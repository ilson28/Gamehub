# Requisitos y criterios de aceptación — Flujo de devoluciones

Insumo para el agente **planner**. Misma estructura que `requisitos-venta.md` y `requisitos-alquiler.md`.
Fuentes: `README.md`, código (`RegistroDevolucionServiceImpl.save`, `History.jsx`, `Returns.jsx`, `ButtonsModalTransaction.jsx`) y la app corriendo.

Ya automatizados: **venta** (`tests/venta/`, 23 pruebas) y **alquiler** (`tests/alquiler/`, 9 pruebas). No repitas escenarios de esos planes.

## 1. Matriz de requisitos

| ID | Requisito | Fuente | Estado en el código |
|---|---|---|---|
| RN-09 | Un alquiler se puede devolver desde el detalle del Historial | `History.jsx` · `ButtonsModalTransaction.jsx` | ✅ Botón "Realizar Devolucion" |
| RN-10 | Al devolver, la transacción pasa a estado `devuelto` | `RegistroDevolucionServiceImpl.save` → `updateEstadoToDevuelto` | ✅ Implementado |
| RN-11 | La devolución queda registrada y se consulta en `/returns` | `Returns.jsx` | ✅ Implementado |
| RN-12 | Solo los alquileres no devueltos ofrecen "Realizar Devolucion" | `ButtonsModalTransaction.jsx:23` | ✅ La condición es `tipo == "alquiler" && estado !== "devuelto"` |
| RN-13 | `/returns` permite filtrar por cédula y por rango de fechas | `Returns.jsx` | ✅ Filtros + botón "Clean" |
| **RN-02** | **Al devolver un alquiler el stock se restablece** | README | ✅ **Implementado** (antes no lo estaba): `RegistroDevolucionServiceImpl.save` suma al stock la cantidad de cada línea con `VideoJuegoRepository.addStock`. La prueba 1.4 ya no es `test.fixme` |

## 2. Datos de prueba (`backend/GameHub/src/main/resources/e2e-seed.sql`)

| Videojuego | Stock inicial | Precio venta | Precio alquiler | Uso |
|---|---|---|---|---|
| `E2E Devolucion` | 100 | 160000 | **40000** | **Único juego de este plan** |
| `E2E Venta`, `E2E Validaciones`, `E2E Alquiler`, `E2E Agotado` | — | — | — | De otros planes: **NO USAR** |

Reglas:
- Todos los escenarios usan **`E2E Devolucion`**. Cada prueba alquila primero (eso descuenta stock) y luego devuelve.
- **Crea los alquileres como precondición por API** con `api.crearAlquiler('E2E Devolucion', cliente, cant)`: es más rápido y estable que repetir el carrito, que ya está cubierto en los otros planes. Devuelve la transacción con su `id`.
- Aserciones de stock **relativas** con `api.getStock('E2E Devolucion')`.
- Cliente con `clienteUnico()`; localiza filas por su cédula, **nunca** por conteos globales (otras pruebas en paralelo crean devoluciones).
- Agrupa en un `describe` serial lo que lea o mute el stock, como en `tests/alquiler/alquiler-exitoso.spec.ts`, e indica el presupuesto de unidades.

## 3. Criterios de aceptación

```gherkin
Escenario: Devolución exitosa desde el Historial                     # RN-09, RN-10, RN-11
  Dado un alquiler de "E2E Devolucion" con estado "alquilado"
  Cuando abro su detalle en Historial (pestaña Alquileres) y presiono "Realizar Devolucion"
  Entonces veo "¡Devolución realizada con éxito!"
  Y tras la cuenta atrás la app navega sola a /returns
  Y la devolución aparece en /returns con la cédula del cliente
  Y el alquiler queda con estado "devuelto" en el Historial

Escenario: Un alquiler devuelto ya no se puede devolver             # RN-12
  Dado un alquiler ya devuelto
  Cuando abro su detalle en Historial
  Entonces el botón "Realizar Devolucion" no está, y solo queda "Cancelar"

Escenario: Una venta no ofrece devolución                            # RN-12
  Dada una venta en el Historial (pestaña Ventas)
  Cuando abro su detalle
  Entonces el botón "Realizar Devolucion" no está

Escenario: El stock se restablece al devolver                        # RN-02 (NO IMPLEMENTADO → test.fixme)
  Dado que "E2E Devolucion" tenía stock S y alquilé 2 unidades (stock S−2)
  Cuando registro la devolución de ese alquiler
  Entonces el stock de "E2E Devolucion" vuelve a ser S
```

## 4. Selectores disponibles (accesibles, verificados)

- **Historial** (`/history`): pestañas `getByRole('tab', { name: 'Ventas' | 'Alquileres' })` con `aria-selected`; filtro `getByLabel('Filtrar alquileres por estado')` (opciones "Todos los alquileres" / "Alquileres Activos" / "Alquileres devueltos"); `getByLabel('Filtrar por fecha')`; filas `getByRole('row').filter({ hasText: <cedula> })`; icono `getByRole('img', { name: 'Ver detalles' })`; en la pestaña Alquileres hay columnas **Fecha Devolución** y **Estado**.
- **Modal de detalle**: título "Detalle de la Transacción"; botones "Cancelar" y "Realizar Devolucion".
- **Notificación de devolución**: "¡Devolución realizada con éxito!", con el texto "Serás redirigido a la vista de devoluciones en N segundos..." y el enlace **"Ir ahora"** (es un `<span>` con `onClick`: localízalo por texto, no por rol).
- **Devoluciones** (`/returns`): encabezado "Devoluciones"; tarjetas "Total Devoluciones", "Este Mes", "Hoy"; filtros `getByLabel('Buscar cliente')` (input de cédula), `getByLabel('Fecha Desde')`, `getByLabel('Fecha Hasta')` y botón **"Clean"**; tabla con columnas **Cédula | Cliente | Alquiler | Devolucion | Acciones**; celda de detalle `getByRole('button', { name: 'Ver detalles de la devolucion de <cedula>' })`; paginación `getByRole('button', { name: 'Pagina anterior' | 'Pagina siguiente' | 'Ir a la pagina N' })`; estado vacío "Nada por aquí" / "El registro de devoluciones esta vacio!".
- **Fixtures** (`fixtures/gamehub.ts`): `api.crearAlquiler(titulo, cliente, cant, fechaDev?)`, `api.getStock`, `api.getAlquileresPorEstado('alquilado'|'devuelto')`, `api.getTransaccionesPorTipo('alquiler'|'venta')`, `api.getDevoluciones(cedula?)`, `api.getTotalDevoluciones()`, `clienteUnico()`, `fechaFutura(dias)`.

## 5. Trampas conocidas

- **RN-02 va en `test.fixme`**, con la aserción correcta (el stock vuelve a su valor previo). El resto de escenarios aseveran el comportamiento actual y anotan el bug con `test.info().annotations.push({ type: 'bug' | 'observación', ... })`.
- **Redirección automática**: tras devolver hay una cuenta atrás de ~5 s y la app navega sola a `/returns`. Espera la URL (`waitForURL`) en vez de un tiempo fijo; el enlace "Ir ahora" permite adelantarla.
- **Bug A12 del Historial** (`specs/alquiler.md`): al cambiar de pestaña el filtro de estado muestra "todos" pero sigue aplicando el anterior. Si cambias de pestaña, vuelve a elegir el filtro explícitamente.
- **Conteos globales**: "Total Devoluciones" y "Hoy" son globales y suben con las pruebas en paralelo. No afirmes valores absolutos; si compruebas que aumentan, léelos antes y después **en la misma prueba** y acepta un incremento de al menos 1.
- **`Returns.jsx` muestra "Mostrando 1-10 de N"** con el rango fijo, aunque haya menos resultados o estés en otra página (**posible bug**).
- `/api/registro-devoluciones` devuelve un `Page` plano y `/total-devoluciones` un número desnudo; los fixtures ya lo resuelven.
- Devolver dos veces la misma transacción por API acaba en **500** (restricción única en `id_trans`), no en 409. Desde la UI no es alcanzable, porque el botón desaparece: déjalo como nota, sin prueba de UI.
