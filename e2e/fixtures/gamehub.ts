import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { ADMIN, API_URL, FRONTEND_URL } from './env';

export type Videojuego = {
  id: number;
  titulo: string;
  stock: number;
  precioVenta: number;
  precioAlquiler: number;
};

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
