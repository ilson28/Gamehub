import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { ADMIN, API_URL, FRONTEND_URL } from './env';

export type Videojuego = {
  id: number;
  titulo: string;
  stock: number;
  precioVenta: number;
  precioAlquiler: number;
};

export type Cliente = {
  cedula: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
};

export type Transaccion = {
  id: number;
  tipo: string;
  estado: string;
  total: number;
  fechaTrans?: string;
  fechaDev?: string | null;
  cliente?: Cliente;
};

export type Devolucion = {
  id: number;
  fecha: string;
  transaccion: Transaccion;
};

/** Fecha ISO (YYYY-MM-DD) a N dias vista: fechaDev se valida con @Future en el backend. */
export function fechaFutura(dias = 7): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Acceso directo a la API para leer estado y preparar precondiciones sin pasar por la UI. */
export class GameHubApi {
  constructor(private readonly request: APIRequestContext) {}

  async getVideojuego(titulo: string): Promise<Videojuego> {
    const response = await this.request.get('/api/videojuegos', { params: { titulo } });
    expect(response.ok()).toBeTruthy();
    const { data } = await response.json();
    const juego = (data as Videojuego[]).find((j) => j.titulo === titulo);
    if (!juego) throw new Error(`No existe el videojuego "${titulo}" (revisa e2e-seed.sql)`);
    return juego;
  }

  async getStock(titulo: string): Promise<number> {
    return (await this.getVideojuego(titulo)).stock;
  }

  /** Transacciones por tipo ("venta" | "alquiler"); es de los pocos endpoints que trae las lineas transJuegos. */
  async getTransaccionesPorTipo(tipo: 'venta' | 'alquiler', fecha?: string): Promise<Transaccion[]> {
    const response = await this.request.get(`/api/transacciones/type/${tipo}`, { params: fecha ? { fecha } : {} });
    expect(response.ok(), `GET /api/transacciones/type/${tipo} devolvio ${response.status()}`).toBeTruthy();
    return (await response.json()).data as Transaccion[];
  }

  /** Alquileres filtrados por estado ("alquilado" | "devuelto"), como hace el filtro del Historial. */
  async getAlquileresPorEstado(estado: 'alquilado' | 'devuelto'): Promise<Transaccion[]> {
    const response = await this.request.get(`/api/transacciones/alquiler/${estado}`);
    expect(response.ok(), `GET /api/transacciones/alquiler/${estado} devolvio ${response.status()}`).toBeTruthy();
    return (await response.json()).data as Transaccion[];
  }

  /**
   * Crea una transaccion por API para usarla como precondicion sin pasar por el carrito.
   * Descuenta stock igual que la UI. Devuelve la transaccion creada (con su id).
   */
  async crearTransaccion(opciones: {
    titulo: string;
    cliente: Cliente;
    tipo?: 'venta' | 'alquiler';
    cant?: number;
    fechaDev?: string;
  }): Promise<Transaccion> {
    const { titulo, cliente, tipo = 'alquiler', cant = 1, fechaDev } = opciones;
    const juego = await this.getVideojuego(titulo);
    const response = await this.request.post('/api/transacciones', {
      data: {
        tipo,
        fechaDev: tipo === 'alquiler' ? (fechaDev ?? fechaFutura()) : null,
        cliente,
        transJuegos: [{ gameId: juego.id, cant }],
      },
    });
    expect(response.ok(), `POST /api/transacciones devolvio ${response.status()}`).toBeTruthy();
    return (await response.json()).data as Transaccion;
  }

  /** Atajo: alquila `cant` unidades de `titulo` para `cliente`. */
  async crearAlquiler(titulo: string, cliente: Cliente, cant = 1, fechaDev?: string): Promise<Transaccion> {
    return this.crearTransaccion({ titulo, cliente, tipo: 'alquiler', cant, fechaDev });
  }

  /** Registros de devolucion; el endpoint devuelve un Page plano (sin el sobre ApiResponse). */
  async getDevoluciones(cedula?: number | string): Promise<Devolucion[]> {
    const response = await this.request.get('/api/registro-devoluciones', {
      params: cedula ? { cedula: String(cedula) } : {},
    });
    expect(response.ok(), `GET /api/registro-devoluciones devolvio ${response.status()}`).toBeTruthy();
    return (await response.json()).content as Devolucion[];
  }

  /** Total de devoluciones; este endpoint responde un numero desnudo, sin sobre. */
  async getTotalDevoluciones(): Promise<number> {
    const response = await this.request.get('/api/registro-devoluciones/total-devoluciones');
    expect(response.ok()).toBeTruthy();
    return Number(await response.text());
  }

  async getTransaccionesDeCliente(cedula: number | string) {
    const response = await this.request.get(`/api/transacciones/cliente/${cedula}`);
    expect(response.ok()).toBeTruthy();
    // Este endpoint devuelve el arreglo plano, sin el sobre ApiResponse.
    const body = await response.json();
    return (Array.isArray(body) ? body : body.data) as Array<{ id: number; tipo: string; estado: string; total: number }>;
  }
}

/** Cliente con cédula única por ejecución (9 dígitos: cabe en el Integer de Cliente.cedula). */
export function clienteUnico() {
  const digitos = (n: number) => Math.floor(Math.random() * 10 ** n).toString().padStart(n, '0');
  return {
    cedula: `1${digitos(8)}`,
    nombre: 'Cliente',
    apellido: `E2E ${digitos(4)}`,
    direccion: 'Cra 51b #79-56',
    telefono: `3${digitos(9)}`,
  };
}

type WorkerFixtures = { authToken: string };
type TestFixtures = { api: GameHubApi };

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Login por API una vez por worker: más rápido y estable que loguearse por UI en cada prueba.
  authToken: [
    async ({ playwright }, use) => {
      const request = await playwright.request.newContext({ baseURL: API_URL });
      const response = await request.post('/api/auth/login', { data: ADMIN });
      expect(response.ok(), `Login de ${ADMIN.username} falló con ${response.status()}`).toBeTruthy();
      const { jwt } = await response.json();
      await request.dispose();
      await use(jwt);
    },
    { scope: 'worker' },
  ],

  // El frontend lee el JWT de localStorage["token"] (AuthContext.jsx), así que cada página arranca autenticada.
  // Para una prueba sin sesión: test.use({ storageState: { cookies: [], origins: [] } })
  storageState: async ({ authToken }, use) => {
    await use({
      cookies: [],
      origins: [{ origin: FRONTEND_URL, localStorage: [{ name: 'token', value: authToken }] }],
    });
  },

  api: async ({ playwright, authToken }, use) => {
    const request = await playwright.request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${authToken}` },
    });
    await use(new GameHubApi(request));
    await request.dispose();
  },
});

export { expect };
