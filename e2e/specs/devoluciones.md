# Plan de pruebas E2E - Flujo de devoluciones de GameHub

## Application Overview

## Alcance

Plan de pruebas E2E del **flujo de devoluciones** de GameHub: detalle de un alquiler en `/history` (pestaña Alquileres) -> botón "Realizar Devolucion" -> notificación "¡Devolución realizada con éxito!" con cuenta atrás y enlace "Ir ahora" -> redirección a `/returns` (listado, filtros, tarjetas y detalle de la devolución). La aplicación está en español. Insumo principal: `specs/requisitos-devoluciones.md` (RN-09, RN-10, RN-11, RN-12, RN-13 y RN-02). Este plan **no repite** lo ya automatizado en `tests/venta/` y `tests/alquiler/` (carrito, validaciones de cliente, fecha de devolución pasada, columnas de la pestaña Alquileres, alternancia del filtro de estado antes de devolver, bug A12 explicado allí); se centra en lo que ocurre **al devolver**. Los casos borde se **verificaron manualmente** contra la app corriendo (frontend :5174, backend perfil `e2e` :8090) y, cuando el comportamiento observado difiere de lo esperado, se anota como **COMPORTAMIENTO OBSERVADO / POSIBLE BUG**.

Seed de referencia: `tests/seed.spec.ts` (importa `test`/`expect` de `fixtures/gamehub.ts`, abre `/home` ya autenticada con el JWT en `localStorage["token"]`). **No se inicia sesión por la UI.** Todas las pruebas importan de `../../fixtures/gamehub` y usan `clienteUnico()` y `fechaFutura()`. Las precondiciones (alquileres y ventas) se crean **por API** con `api.crearAlquiler(...)` / `api.crearTransaccion({ tipo: 'venta', ... })`; el carrito no se usa. **La devolución en sí siempre se hace por la UI** (es lo que se prueba y los fixtures no tienen un método para registrar devoluciones).

## Datos de prueba (e2e-seed.sql)

| Videojuego | Stock inicial | Precio venta | Precio alquiler | Uso en este plan |
|---|---|---|---|---|
| `E2E Devolucion` | 100 | 160000 | 40000 | **Único juego de este plan** |
| `E2E Venta`, `E2E Validaciones`, `E2E Alquiler`, `E2E Agotado` | - | - | - | **NO USAR**: pertenecen a otros planes y las pruebas corren en paralelo |

## Convenciones y selectores (todos verificados en la app)

- **Precondición de un alquiler**: `const cliente = clienteUnico(); const alquiler = await api.crearAlquiler('E2E Devolucion', cliente, cant, fechaFutura(7));` (devuelve la transacción con su `id`; `fechaDev` programada futura). Una venta: `api.crearTransaccion({ titulo: 'E2E Devolucion', cliente, tipo: 'venta', cant: 1 })` (estado `vendido`).
- **Receta "devolver por la UI"** (se reutiliza en casi todos los escenarios; se cita como *receta D*): `page.goto('/history')` -> `getByRole('tab', { name: 'Alquileres' })` (queda `aria-selected="true"`; el filtro de estado está en "Todos los alquileres") -> `const fila = page.getByRole('row').filter({ hasText: cliente.cedula })` (`toHaveCount(1)`) -> `fila.getByRole('img', { name: 'Ver detalles' }).click()` -> modal con título "Detalle de la Transacción" y botones `Cancelar` y `Realizar Devolucion` -> `getByRole('button', { name: 'Realizar Devolucion' }).click()`. El historial no tiene paginación, así que la fila siempre se ve.
- **Notificación de devolución** (NO es un `role="dialog"`; localizar por texto): `page.getByText('¡Devolución realizada con éxito!')`; contador `page.getByText(/Serás redirigido a la vista de devoluciones en \d+ segundos\.\.\./)` (arranca en 5 y baja cada segundo; el singular no existe: se vio "1 segundos..."); enlace `page.getByText('Ir ahora', { exact: true })` (es un `<span>` con `onClick`, **no** tiene rol de enlace ni de botón). Tras la cuenta atrás, o al pulsar "Ir ahora", la app navega a `/returns`: **usar `await page.waitForURL(/\/returns$/)`** (cuenta atrás ~5 s; el timeout por defecto de 60 s de la prueba alcanza, o poner `{ timeout: 15_000 }`), nunca `waitForTimeout`.
- **Devoluciones** (`/returns`): encabezado `getByRole('heading', { name: 'Devoluciones' })`; tarjetas (cada una es un `div` con dos `span`: etiqueta y valor): `page.getByText('Total Devoluciones' | 'Este Mes' | 'Hoy', { exact: true }).locator('xpath=following-sibling::span')`; filtros `getByLabel('Buscar cliente')` (input de cédula, id `cedula`), `getByLabel('Fecha Desde')`, `getByLabel('Fecha Hasta')` (`<input type="date">`, usar `fill('YYYY-MM-DD')`) y `getByRole('button', { name: 'Clean' })`; tabla con cabeceras exactas `Cédula | Cliente | Alquiler | Devolucion | Acciones` (`getByRole('columnheader')`); fila `getByRole('row').filter({ hasText: cliente.cedula })`; celda de detalle `getByRole('button', { name: \`Ver detalles de la devolucion de ${cliente.cedula}\` })` (es un `<td role="button">`); paginación `getByRole('button', { name: 'Pagina anterior' | 'Pagina siguiente' | 'Ir a la pagina 1' })`, con `aria-current="true"` en la activa y el texto "Mostrando 1-10 de N resultados". Estado vacío: "Nada por aquí" / "El registro de devoluciones esta vacio!". Orden: la más reciente primero.
- **Detalle de una devolución** (`/returns`): mismo título "Detalle de la Transacción", datos del cliente, juego `E2E Devolucion`, `cantidad: N x 40000`, TOTAL, "Cantidad de items", una **banda verde** con el texto "Devolución Procesada Exitosamente" y **solo** el botón `Cancelar` (sin "Realizar Devolucion" ni bloque "Información de la Transacción").
- **Historial**: `getByRole('tab', { name: 'Ventas' | 'Alquileres' })` con `aria-selected`; `getByLabel('Filtrar alquileres por estado')` (`selectOption({ label: 'Todos los alquileres' | 'Alquileres Activos' | 'Alquileres devueltos' })`, valores `todos` / `alquilado` / `devuelto`); `getByLabel('Filtrar por fecha')`; en la pestaña Alquileres las columnas extra `Fecha Devolución` y `Estado`.
- **Fixtures usados**: `api.crearAlquiler`, `api.crearTransaccion`, `api.getStock`, `api.getAlquileresPorEstado('alquilado' | 'devuelto')` (cada elemento trae `cliente.cedula` como **número**), `api.getDevoluciones(cedula?)` (cada elemento: `{ id, fecha, transaccion }`), `api.getTotalDevoluciones()`, `clienteUnico()`, `fechaFutura(dias)`.

## Supuestos / Riesgos

1. **Estado inicial fresco**: backend recién arrancado (BD `gamehub_e2e` recreada con `import.sql` + `e2e-seed.sql`). La exploración de este plan consumió **4 unidades** de `E2E Devolucion` (stock actual 96) y dejó 3 transacciones (cédulas `155000111`, `155000222`, `155000333`) y 3 registros de devolución (dos hechos por UI, uno por API sobre una venta). **Reiniciar el backend E2E** antes de ejecutar (`playwright.config.ts` usa `reuseExistingServer` fuera de CI: sin reinicio el stock se acumula).
2. **Un solo juego, varios escenarios que tocan su stock**: `fullyParallel: true`, así que **todos los escenarios que crean alquileres/ventas de `E2E Devolucion` o leen su stock van en el mismo archivo y el mismo `test.describe` con `test.describe.configure({ mode: 'serial' })`**: `tests/devoluciones/devolucion-historial.spec.ts` (escenarios 1.1 a 1.9). Solo el escenario 2.1 (estado vacío) **no consume ni lee stock** y va en otro archivo, paralelizable. No repartir los escenarios 1.x en archivos distintos: el escenario 1.4 (RN-02) compara el stock antes y después y cualquier otro alquiler concurrente lo falsearía.
3. **Presupuesto de stock de `E2E Devolucion` (inicial 100)**: 1.1 consume **1** unidad; 1.2 **1**; 1.3 **1** (venta); 1.4 **2**; 1.5 **1**; 1.6 **2** (dos clientes); 1.7 **2** (un alquiler devuelto y otro activo); 1.8 **1**; 1.9 **1**; 2.1 **0**. Total **12 de 100** por corrida. Como **la devolución no restablece el stock** (RN-02 no implementado, ver D1), el stock no se recupera: caben ~8 corridas por arranque del backend (con `retries: 2` en CI el peor caso es 36/corrida, ~2 corridas). **Reiniciar el backend cada 2-3 corridas y nunca agotar el juego.** No agregar más unidades sin revisar este presupuesto.
4. **Aislamiento por cédula, no por conteo global**: otras pruebas (y las de otros planes, que también devuelven) crean devoluciones en paralelo. Nunca afirmar el número de filas de `/returns`, el total "Mostrando 1-10 de N" ni valores absolutos de las tarjetas. Localizar siempre por la cédula de `clienteUnico()`. Como `/returns` pagina de 10 en 10 (más reciente primero), **filtrar por `getByLabel('Buscar cliente')` con la cédula propia antes de afirmar sobre una fila** (salvo en 1.6, donde el filtro es el objeto de la prueba y se encadena igualmente con la cédula) para no depender de la página en la que cae la fila.
5. **Tarjetas de métricas**: solo incremento relativo. Leer el "antes" **por API** (`api.getTotalDevoluciones()`), no del DOM: mientras carga, la tarjeta muestra `0` (`value={x || 0}`), por lo que un "antes" leído de la UI podría ser un 0 falso. Aceptar un incremento de **al menos 1** (otros workers pueden sumar más) y afirmar con `expect.poll`/aserciones con reintentos.
6. **Caché de TanStack Query (staleTime 2 h)**: la app invalida las consultas de `/returns` y del Historial al devolver (verificado: tras la redirección por SPA las tarjetas y la lista ya muestran la devolución nueva). Pero un `/returns` o `/history` ya cargado **no se actualiza** si el cambio ocurre por otra vía (p. ej. API; se observó un Historial navegado por SPA sin un alquiler creado por API después de cargarlo): en las pruebas cargar la página con `page.goto(...)` (carga limpia) **después** de crear los datos, o llegar a ella por la redirección. No usar `page.goBack()`.
7. **Fecha y zona horaria**: la fecha de la devolución (`fecha`) y la del alquiler (`fechaTrans`) las pone el **servidor** (hoy). Para filtros por fecha no usar `fechaFutura(0)` (UTC): leer la fecha de la propia fila (`/returns`, celda "Devolucion", formato `YYYY-MM-DD`) y derivar "ayer" y "mañana" de ella. Cerca de la medianoche del servidor una corrida puede cruzar de día: documentarlo en el código.
8. **Bug A12 del Historial** (`specs/alquiler.md`): al cambiar de pestaña el filtro de estado muestra "Todos" pero sigue aplicando el anterior. En este plan **no se cambia de pestaña tras haber elegido un filtro de estado**; en 1.7 se recarga con `page.goto('/history')` antes de cambiar de filtro. Si en algún escenario se pasa por Ventas y se vuelve a Alquileres, volver a elegir el filtro explícitamente.
9. **Fuera de alcance**: paginación de `/returns` (exige más de 10 devoluciones en un mismo filtro; no se verificó), el icono "Eliminar registro" del Historial, devolver dos veces la misma transacción (no alcanzable desde la UI: el botón desaparece; por API responde 500, ver D7), alquileres de varios juegos distintos, subida de imágenes y todo lo cubierto en `tests/venta/` y `tests/alquiler/`.

## Hallazgos de la exploración (posibles bugs / comportamiento observado)

| # | Observación | Donde se prueba |
|---|---|---|
| D1 | **RN-02 NO implementado (POSIBLE BUG, el README promete lo contrario).** Se alquilaron 2 unidades (stock 100 -> 98), se devolvió el alquiler por la UI y el stock siguió en 98 (verificado por `GET /api/videojuegos`). `RegistroDevolucionServiceImpl.save` solo marca la transacción como `devuelto` y guarda el registro. | 1.4 (`test.fixme`) |
| D2 | `Returns.jsx` muestra siempre **"Mostrando 1-10 de N resultados"**: con 1 resultado filtrado se vio literalmente "Mostrando 1-10 de 1 resultados". El rango es fijo. **POSIBLE BUG.** | 1.6 |
| D3 | En `/returns` la columna **"Alquiler" muestra `fechaTrans`** (el día en que se hizo el alquiler), no la fecha de devolución programada (`fechaDev`, p. ej. 2026-11-02); "Devolucion" es la fecha real en que se registró (hoy). La fecha programada solo se ve en el detalle del Historial: ni la tabla ni el detalle de `/returns` la muestran. **COMPORTAMIENTO OBSERVADO** (puede inducir a creer que el alquiler no tiene fecha límite). | 1.1, 1.5 |
| D4 | El estado vacío al filtrar con una cédula inexistente dice **"El registro de devoluciones esta vacio!"** aunque existan devoluciones (solo no hay coincidencias). Además las tarjetas **no** reaccionan al filtro (siguen mostrando los totales globales: se vio 2/2/2 con el filtro sin resultados). **POSIBLE BUG de usabilidad.** | 1.9, 2.1 |
| D5 | El filtro de cédula de `/returns` es de tipo **"contiene"** (`LIKE %x%`): `1550001` encuentra `155000111`. No es una búsqueda exacta. **COMPORTAMIENTO OBSERVADO.** El filtro de fechas es inclusivo en ambos extremos (`fecha >= desde` y `fecha <= hasta`; verificado con desde=hasta=hoy, desde=mañana, hasta=ayer). | 1.6 |
| D6 | **El backend acepta devolver una venta por API**: `POST /api/registro-devoluciones { idTransaccion: <venta>, fecha }` responde **201** y la venta pasa a estado `devuelto`. RN-12 solo se impone en la UI (el botón no se muestra). **POSIBLE BUG de validación en backend.** | 1.3 (paso opcional final) |
| D7 | Devolver dos veces la misma transacción por API responde **500** (`Duplicate entry '1' for key 'registro_dev...'`), no 409. Verificado. Desde la UI no es alcanzable. Nota sin prueba de UI. | Supuesto 9 |
| D8 | La notificación de éxito **no es un `role="dialog"`** y "Ir ahora" es un `<span>` sin rol: hay que localizarlos por texto. El contador usa siempre el plural ("1 segundos..."). **COMPORTAMIENTO OBSERVADO** (accesibilidad). | 1.1, 1.8 |
| D9 | Tras devolver, la lista del Historial detrás de la notificación ya se refresca (un filtro "Alquileres Activos" abierto pasa a mostrar "Historial de alquiler sin registros!"), y la redirección a `/returns` muestra tarjetas y lista actualizadas (los tres contadores pasaron de 0 a 1). Es el comportamiento correcto; se deja como criterio de éxito. | 1.1, 1.9 |
| D10 | El detalle de la devolución en `/returns` omite el bloque "Información de la Transacción" (fecha y hora, fecha de devolución) que sí aparece en el detalle del Historial; solo muestra la banda verde. **COMPORTAMIENTO OBSERVADO.** | 1.5 |

## Tabla de trazabilidad

| Requisito | Escenarios |
|---|---|
| RN-09 (devolver desde el detalle del Historial) | 1.1, 1.8, 1.9 |
| RN-10 (la transacción pasa a `devuelto`) | 1.1, 1.2, 1.7 |
| RN-11 (queda registrada y se consulta en `/returns`) | 1.1, 1.5, 1.6, 1.9 |
| RN-12 (solo alquileres no devueltos ofrecen devolución) | 1.2, 1.3, 1.5 |
| RN-13 (filtros por cédula, fechas y "Clean") | 1.6, 2.1 |
| RN-02 (el stock se restablece al devolver) | 1.4 (`test.fixme`) |
| Criterio Gherkin 1 (devolución exitosa) | 1.1 |
| Criterio Gherkin 2 (alquiler devuelto no se puede devolver) | 1.2 |
| Criterio Gherkin 3 (venta no ofrece devolución) | 1.3 |
| Criterio Gherkin 4 (stock se restablece) | 1.4 |
| Casos borde descubiertos (detalle en `/returns`, filtro de estado del Historial, "Ir ahora", tarjetas, estado vacío) | 1.5, 1.7, 1.8, 1.9, 2.1 |

## Test Scenarios

### 1. 1. Devoluciones que consumen stock de E2E Devolucion (un único archivo, describe serial)

**Seed:** `tests/seed.spec.ts`

#### 1.1. 1.1 Devolución exitosa desde el Historial: notificación, redirección y registro en /returns

**File:** `tests/devoluciones/devolucion-historial.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-09, RN-10, RN-11 (Gherkin 1). Videojuego `E2E Devolucion`; consume **1** unidad. `const cliente = clienteUnico()`, `const fechaDev = fechaFutura(7)`, `const alquiler = await api.crearAlquiler('E2E Devolucion', cliente, 1, fechaDev)`. Sin devoluciones previas de ese cliente: `(await api.getDevoluciones(cliente.cedula))` tiene longitud 0.
    - expect: Criterio de éxito: todas las aserciones siguientes se cumplen.
    - expect: Criterio de fallo: no aparece la notificación, no hay redirección a `/returns`, falta la fila con la cédula, el estado no pasa a `devuelto` o el registro no existe por API.
  2. Aplicar la *receta D* hasta el detalle: `page.goto('/history')`, pestaña `Alquileres`, fila por cédula y `Ver detalles`. Anotar la fecha de la primera celda de la fila (`fechaTrans`, formato `YYYY-MM-DD`) para comparar luego.
    - expect: La fila muestra tipo `alquiler`, total `$40000`, 'Fecha Devolución' = `fechaDev` y 'Estado' = `alquilado`.
    - expect: El modal 'Detalle de la Transacción' muestra el nombre del cliente, `E2E Devolucion`, `cantidad: 1 x 40000`, 'Fecha de Devolución' = `fechaDev` y los botones `Cancelar` y `Realizar Devolucion`.
  3. Pulsar `getByRole('button', { name: 'Realizar Devolucion' })` y esperar la respuesta del `POST /api/registro-devoluciones` con `page.waitForResponse` (registrarla antes del clic).
    - expect: La respuesta es 201; el cuerpo trae `idTransaccion` = `alquiler.id` y `transaccion.estado` = `devuelto`.
    - expect: Se muestra `getByText('¡Devolución realizada con éxito!')` y el texto `Serás redirigido a la vista de devoluciones en N segundos...` con N entre 1 y 5 y el enlace `getByText('Ir ahora', { exact: true })` visible.
    - expect: OBSERVADO (D8): la notificación no es `role=dialog` y el contador usa el plural también con 1. Anotar con `test.info().annotations` (tipo 'observación').
    - expect: El modal de detalle ya no está (el botón `Realizar Devolucion` queda oculto, `toBeHidden()`).
  4. Sin pulsar nada, esperar la redirección automática: `await page.waitForURL(/\/returns$/)` (cuenta atrás de ~5 s; no usar tiempos fijos).
    - expect: La URL termina en `/returns` y se ve `getByRole('heading', { name: 'Devoluciones' })`.
    - expect: La notificación ya no está visible (`getByText('¡Devolución realizada con éxito!')` con `toHaveCount(0)`).
  5. En `/returns` escribir la cédula en `getByLabel('Buscar cliente')` y localizar la fila `getByRole('row').filter({ hasText: cliente.cedula })`.
    - expect: Existe exactamente una fila (`toHaveCount(1)`).
    - expect: Sus celdas son: cédula (`cliente.cedula`), cliente (`${cliente.nombre} ${cliente.apellido}`), 'Alquiler' = la fecha `fechaTrans` anotada, 'Devolucion' = una fecha `YYYY-MM-DD` (la de hoy en el servidor) y el botón `Ver detalles de la devolucion de <cedula>`.
    - expect: OBSERVADO (D3): la columna 'Alquiler' muestra la fecha del alquiler, **no** `fechaDev`; la fecha programada no aparece en `/returns` (`fila` no contiene `fechaDev`). Anotar con `test.info().annotations` (tipo 'observación').
  6. Verificar el estado por API: `api.getDevoluciones(cliente.cedula)`, `api.getAlquileresPorEstado('devuelto')` y `api.getAlquileresPorEstado('alquilado')`.
    - expect: `getDevoluciones(cedula)` tiene longitud 1 y `[0].transaccion.id` = `alquiler.id`, `[0].transaccion.estado` = `devuelto`.
    - expect: `getAlquileresPorEstado('devuelto')` contiene `Number(cliente.cedula)` y `getAlquileresPorEstado('alquilado')` **no** lo contiene.
  7. Ir al `Historial` con el enlace `getByRole('link', { name: 'Historial' })` (navegación SPA), pulsar la pestaña `Alquileres` y localizar la fila por cédula (D9: la lista ya viene refrescada).
    - expect: La fila existe con 'Estado' = `devuelto` (`getByRole('cell', { name: 'devuelto', exact: true })`) y 'Fecha Devolución' = `fechaDev` (la fecha programada no cambia).

#### 1.2. 1.2 Un alquiler ya devuelto no ofrece 'Realizar Devolucion' (solo Cancelar)

**File:** `tests/devoluciones/devolucion-historial.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-12, RN-10 (Gherkin 2). Videojuego `E2E Devolucion`; consume **1** unidad. `const cliente = clienteUnico()` y `await api.crearAlquiler('E2E Devolucion', cliente, 1)`. Devolver el alquiler con la *receta D* y esperar `waitForURL(/\/returns$/)` pulsando `getByText('Ir ahora', { exact: true })` para no esperar la cuenta atrás (la redirección automática ya se prueba en 1.1).
    - expect: Criterio de éxito: el detalle del alquiler devuelto solo tiene el botón `Cancelar`.
    - expect: Criterio de fallo: sigue apareciendo `Realizar Devolucion` o falta `Cancelar`.
  2. Ir al `Historial` (`getByRole('link', { name: 'Historial' })`), pestaña `Alquileres`, localizar la fila por cédula y confirmar su estado.
    - expect: La fila existe, con tipo `alquiler`, total `$40000` y 'Estado' = `devuelto`.
  3. Pulsar `getByRole('img', { name: 'Ver detalles' })` de esa fila.
    - expect: Se abre 'Detalle de la Transacción' con `E2E Devolucion`, `cantidad: 1 x 40000` y el bloque 'Información de la Transacción'.
    - expect: `getByRole('button', { name: 'Realizar Devolucion' })` tiene `toHaveCount(0)`.
    - expect: `getByRole('button', { name: 'Cancelar' })` es visible y es el **único** botón del modal (verificado: los botones del modal son solo `Cancelar`).
  4. Pulsar `Cancelar`.
    - expect: El título 'Detalle de la Transacción' queda oculto (`toBeHidden()`).
    - expect: No se creó ningún registro adicional: `(await api.getDevoluciones(cliente.cedula))` sigue con longitud 1.

#### 1.3. 1.3 Una venta no ofrece devolución en el Historial

**File:** `tests/devoluciones/devolucion-historial.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-12 (Gherkin 3). Videojuego `E2E Devolucion`; consume **1** unidad (venta creada por API). `const cliente = clienteUnico()` y `const venta = await api.crearTransaccion({ titulo: 'E2E Devolucion', cliente, tipo: 'venta', cant: 1 })`.
    - expect: Criterio de éxito: el detalle de la venta tiene solo `Cancelar`.
    - expect: Criterio de fallo: aparece `Realizar Devolucion` o la venta aparece en `/returns`.
  2. Abrir `/history` (pestaña `Ventas` por defecto, `aria-selected=true`), localizar la fila por cédula y pulsar `getByRole('img', { name: 'Ver detalles' })`.
    - expect: La fila existe con tipo `venta`, total `$160000`.
    - expect: El detalle muestra 'Tipo de Transaccion' = venta, `cantidad: 1 x 160000` y 'Fecha de Devolución' = `N/A`.
    - expect: `getByRole('button', { name: 'Realizar Devolucion' })` tiene `toHaveCount(0)` y `Cancelar` es el único botón del modal.
  3. Pulsar `Cancelar`, ir a `/returns` con `page.goto('/returns')` y filtrar con `getByLabel('Buscar cliente')` por la cédula.
    - expect: Se ve el estado vacío 'Nada por aquí' y no existe ninguna fila con la cédula (`toHaveCount(0)`); `api.getDevoluciones(cliente.cedula)` está vacío.
  4. OPCIONAL (POSIBLE BUG D6, no pasa por la UI; hacerlo al final para no contaminar los pasos anteriores): con `page.request` (cabecera `Authorization: Bearer <localStorage.token>`) enviar `POST ${API_URL}/api/registro-devoluciones` con `{ idTransaccion: venta.id, fecha: <hoy> }`.
    - expect: COMPORTAMIENTO OBSERVADO: el backend responde **201** y la venta pasa a `estado: 'devuelto'` (`api.getTransaccionesDeCliente(cedula)`), aunque RN-12 dice que solo los alquileres se devuelven. Anotar con `test.info().annotations` (tipo 'bug'); si el producto corrige la validación (400/409), actualizar el escenario.

#### 1.4. 1.4 El stock se restablece al devolver (RN-02) [test.fixme]

**File:** `tests/devoluciones/devolucion-historial.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-02 (Gherkin 4). **Este es el único escenario `test.fixme` del plan**: RN-02 no está implementado (D1), pero la aserción debe conservarse en su forma correcta. Videojuego `E2E Devolucion`; consume **2** unidades. `const cliente = clienteUnico()`, `const stockInicial = await api.getStock('E2E Devolucion')` (S).
    - expect: Criterio de éxito (cuando se implemente RN-02): tras devolver, el stock vuelve a S.
    - expect: Criterio de fallo: el stock permanece en S-2 (comportamiento actual).
  2. Crear el alquiler por API: `await api.crearAlquiler('E2E Devolucion', cliente, 2)`.
    - expect: `expect.poll(() => api.getStock('E2E Devolucion')).toBe(stockInicial - 2)`.
  3. Devolverlo por la UI con la *receta D* y pulsar `getByText('Ir ahora', { exact: true })`; esperar `waitForURL(/\/returns$/)`.
    - expect: La devolución queda registrada: `api.getDevoluciones(cliente.cedula)` tiene longitud 1 y `transaccion.estado` = `devuelto`.
    - expect: Esta parte funciona hoy; el fallo esperado aparece solo en el paso siguiente.
  4. Verificar el stock por API (ESTE PASO FALLA HOY) y en la tarjeta del catálogo: `expect.poll(() => api.getStock('E2E Devolucion')).toBe(stockInicial)`; luego `page.goto('/home')` y comprobar `getByTestId('game-card')` filtrado por el heading `E2E Devolucion` con `toHaveAttribute('data-stock', \`Stock: ${stockInicial}\`)`.
    - expect: Aserción correcta (conservar con `test.fixme`): el stock es `stockInicial` y la tarjeta muestra `Stock: <stockInicial>`.
    - expect: COMPORTAMIENTO ACTUAL / POSIBLE BUG D1: el stock se queda en `stockInicial - 2` (verificado: 100 -> 98 -> 98). Dejar la prueba como `test.fixme(...)` con una anotación `{ type: 'bug', description: 'D1 / RN-02: devolver un alquiler no restablece el stock (README lo promete); RegistroDevolucionServiceImpl.save no toca VideoJuegoRepository.' }`.

#### 1.5. 1.5 El detalle de una devolución en /returns muestra la banda verde y solo Cancelar

**File:** `tests/devoluciones/devolucion-historial.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-11, RN-12 (caso borde). Videojuego `E2E Devolucion`; consume **1** unidad. `const cliente = clienteUnico()`, `const fechaDev = fechaFutura(7)` y `await api.crearAlquiler('E2E Devolucion', cliente, 1, fechaDev)`. Devolverlo por la UI con la *receta D* y `Ir ahora`; esperar `waitForURL(/\/returns$/)`.
    - expect: Criterio de éxito: el detalle de la devolución confirma el éxito y no permite devolver otra vez.
    - expect: Criterio de fallo: aparece 'Realizar Devolucion', falta la banda verde o los datos no coinciden con el alquiler.
  2. En `/returns`, escribir la cédula en `getByLabel('Buscar cliente')`, verificar las cabeceras con `getByRole('columnheader')` y pulsar `getByRole('button', { name: \`Ver detalles de la devolucion de ${cliente.cedula}\` })`.
    - expect: Las cabeceras son exactamente 'Cédula', 'Cliente', 'Alquiler', 'Devolucion', 'Acciones'.
    - expect: Se abre el modal 'Detalle de la Transacción'.
  3. Comprobar el contenido del modal.
    - expect: Muestra cédula, teléfono, nombre `Cliente <apellido>` y dirección del cliente, 'Tipo de Transaccion' = alquiler, `E2E Devolucion`, `cantidad: 1 x 40000`, subtotal 40000, TOTAL 40000 y 'Cantidad de items' 1.
    - expect: Muestra la banda verde con el texto 'Devolución Procesada Exitosamente' (`getByText('Devolución Procesada Exitosamente')` visible).
    - expect: OBSERVADO (D10): NO muestra 'Información de la Transacción' ni la 'Fecha de Devolución' (`getByText(fechaDev)` con `toHaveCount(0)`). Anotar con `test.info().annotations` (tipo 'observación').
  4. Comprobar los botones del modal.
    - expect: `getByRole('button', { name: 'Realizar Devolucion' })` tiene `toHaveCount(0)`.
    - expect: `getByRole('button', { name: 'Cancelar' })` es visible y es el único botón dentro del modal.
  5. Pulsar `Cancelar` y volver a abrir el detalle con el mismo botón `Ver detalles de la devolucion de <cedula>`.
    - expect: Tras `Cancelar` el título 'Detalle de la Transacción' queda oculto (`toBeHidden()`).
    - expect: Al reabrirlo el contenido es el mismo (el modal se puede abrir de nuevo).

#### 1.6. 1.6 Filtros de /returns: cédula (parcial), rango de fechas y botón Clean

**File:** `tests/devoluciones/devolucion-historial.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-13 (D2, D5). Videojuego `E2E Devolucion`; consume **2** unidades (dos clientes). `const a = clienteUnico()`, `const b = clienteUnico()`; `await api.crearAlquiler('E2E Devolucion', a, 1)` y lo mismo para `b`. Devolver ambos por la UI con la *receta D* + `Ir ahora` (uno tras otro; el segundo `page.goto('/history')` de nuevo). Terminar en `/returns` con `page.goto('/returns')`.
    - expect: Criterio de éxito: cada filtro deja visibles solo las filas esperadas por cédula y `Clean` restablece los tres campos.
    - expect: Criterio de fallo: un filtro oculta la fila propia, deja pasar una fuera de rango o `Clean` no vacía los campos.
  2. Escribir la cédula completa de `a` en `getByLabel('Buscar cliente')`.
    - expect: La fila de `a` está presente (`toHaveCount(1)`) y la de `b` ausente (`toHaveCount(0)`).
    - expect: OBSERVADO (D2): el texto de la paginación es 'Mostrando 1-10 de 1 resultados' (rango fijo 1-10 aun con 1 resultado). Anotar con `test.info().annotations` (tipo 'bug'); afirmar con una expresión regular `/Mostrando 1-10 de \d+ resultados/` sin valores absolutos.
  3. Reemplazar el texto por una subcadena de la cédula de `a` (por ejemplo `a.cedula.slice(0, 7)`, los 7 primeros dígitos).
    - expect: OBSERVADO (D5): el filtro es de tipo 'contiene': la fila de `a` sigue presente. No afirmar nada sobre la fila de `b` ni sobre otras filas (una subcadena podría coincidir con otras cédulas). Anotar con `test.info().annotations` (tipo 'observación').
  4. Pulsar `Clean`.
    - expect: `getByLabel('Buscar cliente')`, `getByLabel('Fecha Desde')` y `getByLabel('Fecha Hasta')` quedan con valor vacío (`toHaveValue('')`).
  5. Leer la fecha de devolución de la fila de `a` (celda 'Devolucion', `YYYY-MM-DD`; filtrar por cédula si hace falta) y derivar `ayer` y `mañana` a partir de esa fecha (aritmética sobre la cadena en UTC, sin usar `fechaFutura`). Poner `Fecha Desde` = `hoy` y `Fecha Hasta` = `hoy` (la misma fecha de la fila) y la cédula de `a`.
    - expect: La fila de `a` está presente: el rango es inclusivo en ambos extremos (D5).
  6. Cambiar a `Fecha Desde` = `mañana` (dejando `Fecha Hasta` = `hoy`); después a `Fecha Desde` = vacío y `Fecha Hasta` = `ayer`; después a `Fecha Desde` = `ayer` y `Fecha Hasta` = `mañana`. Mantener la cédula de `a` en el filtro.
    - expect: Con `Desde = mañana` la fila de `a` no está (`toHaveCount(0)`) y se ve el estado vacío 'Nada por aquí'.
    - expect: Con `Hasta = ayer` la fila de `a` no está (`toHaveCount(0)`).
    - expect: Con `Desde = ayer` y `Hasta = mañana` la fila de `a` está presente (`toHaveCount(1)`).
  7. Quitar solo la cédula de `a` y poner la de `b` (dejando el rango amplio), y luego pulsar `Clean`.
    - expect: Con la cédula de `b` aparece la fila de `b` y no la de `a`.
    - expect: Tras `Clean` los tres campos quedan vacíos y, escribiendo de nuevo la cédula de `a`, su fila vuelve a aparecer (el listado responde a la limpieza).

#### 1.7. 1.7 Tras devolver, el filtro 'Alquileres devueltos' lista el alquiler y 'Alquileres Activos' ya no

**File:** `tests/devoluciones/devolucion-historial.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-10 (caso borde). Videojuego `E2E Devolucion`; consume **2** unidades. `const devuelto = clienteUnico()` y `const activo = clienteUnico()`; `await api.crearAlquiler('E2E Devolucion', devuelto, 1)` y `await api.crearAlquiler('E2E Devolucion', activo, 1)`. Devolver solo el de `devuelto` con la *receta D* + `Ir ahora` (`waitForURL(/\/returns$/)`). Después `page.goto('/history')` (carga limpia, para no arrastrar el bug A12) y pestaña `Alquileres`.
    - expect: Criterio de éxito: el alquiler devuelto aparece con 'devueltos' y 'Todos', y no con 'Activos'; el alquiler sin devolver aparece con 'Activos' y 'Todos', y no con 'devueltos'.
    - expect: Criterio de fallo: aparece en el filtro equivocado o falta en 'Todos'.
  2. Con el filtro en su valor inicial ('Todos los alquileres', `toHaveValue('todos')`), localizar las dos filas por cédula.
    - expect: La fila de `devuelto` está presente con 'Estado' = `devuelto`; la de `activo` con 'Estado' = `alquilado`.
  3. `getByLabel('Filtrar alquileres por estado').selectOption({ label: 'Alquileres Activos' })`.
    - expect: `toHaveValue('alquilado')` (el valor de la opción).
    - expect: La fila de `activo` está presente (`toHaveCount(1)`) y la de `devuelto` ausente (`toHaveCount(0)`).
  4. `selectOption({ label: 'Alquileres devueltos' })`.
    - expect: `toHaveValue('devuelto')`.
    - expect: La fila de `devuelto` está presente con 'Estado' = `devuelto` y la de `activo` ausente. No afirmar que la lista está vacía de otros clientes.
  5. Verificar por API.
    - expect: `api.getAlquileresPorEstado('devuelto')` contiene `Number(devuelto.cedula)` y no `Number(activo.cedula)`.
    - expect: `api.getAlquileresPorEstado('alquilado')` contiene `Number(activo.cedula)` y no `Number(devuelto.cedula)`.
    - expect: NO cambiar a la pestaña Ventas y volver con un filtro distinto de 'Todos' seleccionado (bug A12 ya documentado en `specs/alquiler.md`).

#### 1.8. 1.8 'Ir ahora' adelanta la redirección sin esperar la cuenta atrás

**File:** `tests/devoluciones/devolucion-historial.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-09 (caso borde). Videojuego `E2E Devolucion`; consume **1** unidad. `const cliente = clienteUnico()` y `await api.crearAlquiler('E2E Devolucion', cliente, 1)`.
    - expect: Criterio de éxito: pulsar 'Ir ahora' navega a `/returns` mientras el contador aún no llegó a 0.
    - expect: Criterio de fallo: la app no navega, o navega a otra ruta.
  2. Aplicar la *receta D* hasta pulsar `Realizar Devolucion` y esperar `getByText('¡Devolución realizada con éxito!')`.
    - expect: Se ve el contador `Serás redirigido a la vista de devoluciones en N segundos...` y la URL sigue siendo `/history` (`expect(page).toHaveURL(/\/history$/)`).
  3. Pulsar `page.getByText('Ir ahora', { exact: true })` inmediatamente (es un `<span>`: no usar `getByRole('link')` ni `getByRole('button')`).
    - expect: `await page.waitForURL(/\/returns$/)`; no hay que esperar los 5 s.
    - expect: La notificación desaparece (`getByText('¡Devolución realizada con éxito!')` con `toHaveCount(0)`).
    - expect: La fila del cliente aparece en `/returns` (filtrar por su cédula con `getByLabel('Buscar cliente')`) y `api.getDevoluciones(cliente.cedula)` tiene longitud 1.
  4. Navegar con el enlace `Inicio` (`getByRole('link', { name: 'Inicio' })`) y quedarse en `/home` unos segundos con `expect(page).toHaveURL(/\/home$/)` repetido con reintentos (sin `waitForTimeout`), para comprobar que la app no vuelve a redirigir sola.
    - expect: La URL se mantiene en `/home`: el temporizador de la notificación no provoca una segunda navegación a `/returns`. En la exploración se permaneció más de 20 s en `/returns` tras 'Ir ahora' sin ninguna segunda redirección; si apareciera, anotarlo como POSIBLE BUG.

#### 1.9. 1.9 Las tarjetas 'Total Devoluciones', 'Este Mes' y 'Hoy' suben al devolver

**File:** `tests/devoluciones/devolucion-historial.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-11 (caso borde, D9). Videojuego `E2E Devolucion`; consume **1** unidad. `const cliente = clienteUnico()`, `await api.crearAlquiler('E2E Devolucion', cliente, 1)` y `const totalAntes = await api.getTotalDevoluciones()`. **No** afirmar valores absolutos: otros workers pueden devolver a la vez.
    - expect: Criterio de éxito: tras devolver, las tres tarjetas muestran al menos 1 más que antes.
    - expect: Criterio de fallo: alguna tarjeta no cambia o baja.
  2. Aplicar la *receta D* y `Ir ahora`; esperar `waitForURL(/\/returns$/)`. Leer las tarjetas con `page.getByText('Total Devoluciones' | 'Este Mes' | 'Hoy', { exact: true }).locator('xpath=following-sibling::span')`.
    - expect: `await expect.poll(async () => Number(await totalTarjeta.innerText())).toBeGreaterThanOrEqual(totalAntes + 1)` (la tarjeta muestra `0` mientras carga: no leer una sola vez).
    - expect: `Este Mes` y `Hoy` son >= 1 (`toBeGreaterThanOrEqual(1)` con `expect.poll`) y ambos <= `Total Devoluciones` (la devolución es de hoy y del mes en curso).
  3. Comparar con la API.
    - expect: `expect.poll(() => api.getTotalDevoluciones())` es >= `totalAntes + 1`.
    - expect: La tarjeta 'Total Devoluciones' de una carga limpia (`page.reload()`) es >= `totalAntes + 1` y la fila del cliente existe al filtrar por su cédula.
  4. Escribir una cédula inexistente (`'000000001'`) en `getByLabel('Buscar cliente')` y releer las tarjetas.
    - expect: OBSERVADO (D4): las tarjetas no cambian con el filtro (siguen siendo >= `totalAntes + 1`): reflejan totales globales, no los resultados filtrados. Anotar con `test.info().annotations` (tipo 'observación').

### 2. 2. Devoluciones sin consumir stock (no leen el stock; paralelizables)

**Seed:** `tests/seed.spec.ts`

#### 2.1. 2.1 Filtrar por una cédula inexistente muestra el estado vacío y Clean restablece los filtros

**File:** `tests/devoluciones/filtros-vacio.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-13 (D4). **Consume 0 unidades** y no crea datos. Estado de partida: `page.goto('/returns')` con la sesión sembrada. No afirmar si hay o no devoluciones previas (otros planes pueden haberlas creado). Registrar con `page.on('request')` las peticiones `GET` a `/api/registro-devoluciones` (sin las de `/total-devoluciones`, `/devoluciones-mes` ni `/devoluciones-dia`).
    - expect: Criterio de éxito: una cédula inexistente da el estado vacío sin tabla y `Clean` vacía los campos y la consulta deja de llevar filtros.
    - expect: Criterio de fallo: aparece la tabla con filas para la cédula inexistente o `Clean` deja valores escritos.
  2. Comprobar el encabezado y los controles.
    - expect: Se ve `getByRole('heading', { name: 'Devoluciones' })` y las tres tarjetas ('Total Devoluciones', 'Este Mes', 'Hoy') con un valor numérico.
    - expect: `getByLabel('Buscar cliente')` (placeholder 'Cédula'), `getByLabel('Fecha Desde')`, `getByLabel('Fecha Hasta')` y el botón `Clean` están visibles y los tres campos vacíos (los `label` apuntan a sus inputs).
  3. Escribir la cédula inexistente `'000000001'` en `getByLabel('Buscar cliente')` (ninguna cédula de `clienteUnico()` empieza por 0, así que no puede coincidir con la búsqueda 'contiene').
    - expect: Se ve 'Nada por aquí' y 'El registro de devoluciones esta vacio!' (`getByText`).
    - expect: No existe ninguna tabla (`getByRole('table')` con `toHaveCount(0)`) ni botones de paginación (`getByRole('button', { name: 'Pagina siguiente' })` con `toHaveCount(0)`).
    - expect: La última petición registrada lleva `cedula=000000001`.
    - expect: OBSERVADO (D4): el mensaje dice 'vacio' como si no hubiera registros, cuando solo no hay coincidencias; las tarjetas siguen mostrando los totales globales. Anotar con `test.info().annotations` (tipo 'bug').
  4. Pulsar `getByRole('button', { name: 'Clean' })`.
    - expect: Los tres campos (`Buscar cliente`, `Fecha Desde`, `Fecha Hasta`) quedan con valor vacío (`toHaveValue('')`).
    - expect: La última petición a `/api/registro-devoluciones` ya no lleva el parámetro `cedula` (con reintentos, p. ej. `expect.poll`). No afirmar nada sobre si hay filas o no tras limpiar: depende de los datos de otros planes.
  5. Probar un rango sin datos: `Fecha Desde` = `2020-01-01` y `Fecha Hasta` = `2020-12-31` (ninguna devolución es de 2020).
    - expect: Se ve 'Nada por aquí'; el listado no muestra ninguna fila.
    - expect: Al pulsar `Clean` ambos campos de fecha quedan vacíos.
