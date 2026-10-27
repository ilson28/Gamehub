# Plan de pruebas E2E - Flujo de alquiler de GameHub

## Application Overview

## Alcance

Plan de pruebas E2E del **flujo de alquiler** de GameHub (catalogo `/home` -> carrito `/cart` con tipo "Alquiler" y fecha de devolucion -> modal "Confirmar Transaccion" -> notificacion -> `/history`, pestana Alquileres). La aplicacion esta en espanol. Insumo principal: `specs/requisitos-alquiler.md` (RN-01, RN-04, RN-05, RN-06, RN-07, RN-08, VAL-04). Este plan **no repite** lo ya automatizado en `tests/venta/` (cliente existente, validaciones de cedula/telefono, carrito vacio, juego agotado, alquiler sin fecha = 3.6, alternancia de tipo con `E2E Validaciones` = 3.5); se centra en lo que diferencia al alquiler. Los casos borde se **verificaron manualmente** contra la app corriendo (frontend :5174, backend perfil `e2e` :8090); cuando el comportamiento observado difiere de lo esperado se anota como **COMPORTAMIENTO OBSERVADO / POSIBLE BUG**.

Seed de referencia: `tests/seed.spec.ts` (importa `test`/`expect` de `fixtures/gamehub.ts`, abre `/home` ya autenticada con el JWT en `localStorage["token"]`). **No se inicia sesion por la UI.** Todas las pruebas importan de `../../fixtures/gamehub` y usan `clienteUnico()` y `fechaFutura()`.

## Datos de prueba (e2e-seed.sql)

| Videojuego | Stock inicial | Precio venta | Precio alquiler | Uso en este plan |
|---|---|---|---|---|
| `E2E Alquiler` | 100 | 150000 | 40000 | **Unico juego de este plan** |
| `E2E Venta`, `E2E Validaciones`, `E2E Devolucion`, `E2E Agotado` | - | - | - | **NO USAR**: pertenecen a otros planes y las pruebas corren en paralelo |

## Convenciones y selectores (todos verificados)

- Tarjeta: `page.getByTestId('game-card').filter({ has: page.getByRole('heading', { name: 'E2E Alquiler' }) })`; stock en su atributo `data-stock` (`"Stock: N"`). Botones `getByRole('button', { name: '+', exact: true })` / `{ name: '-', exact: true }`; `getByRole('spinbutton')` es **de solo lectura** (no usar `fill`). Boton por juego: `getByRole('button', { name: 'Agregar E2E Alquiler al carrito' })`. Navegacion: `getByRole('link', { name: 'Carrito' | 'Historial' | 'Inicio' })`.
- Carrito: radios `getByRole('radio', { name: 'Venta' | 'Alquiler' })`; `getByLabel('Fecha de devolución')` (`<input type="date" name="fechaDev">`, **solo existe en el DOM con Alquiler**, sin `min`); formulario `getByLabel('Cedula' | 'Nombre' | 'Apellidos' | 'Direccion' | 'Telefono')`; `getByRole('button', { name: 'Finalizar Transaccion' })`; `getByRole('button', { name: 'Eliminar E2E Alquiler del carrito' })`. Resumen: `page.locator('p', { hasText: /^Total$/ }).locator('..')` (texto `Total $120000`), igual para `Tipo` y `Videojuegos` (como en `tests/venta/carrito-tipo.spec.ts`).
- Modal: titulo "Confirmar Transacción"; botones `Cancelar` y `Confirmar transaccion` (sin tilde, "t" minuscula). Contiene cedula, telefono, nombre, direccion, tipo, `cantidad: N x PRECIO`, `subtotal`, `TOTAL` y `Cantidad de items`.
- Historial (`/history`): las pestanas **YA son accesibles**: `getByRole('tab', { name: 'Ventas' | 'Alquileres' })` con `aria-selected` (verificado: "Ventas" `true` por defecto); filtro de estado `getByLabel('Filtrar alquileres por estado')` (`<select>`, solo existe en la pestana Alquileres, opciones "Todos los alquileres" / "Alquileres Activos" / "Alquileres devueltos", valor inicial `todos`); filtro `getByLabel('Filtrar por fecha')`; filas `getByRole('row').filter({ hasText: <cedula> })`; icono `getByRole('img', { name: 'Ver detalles' })`. El detalle ("Detalle de la Transacción") se cierra con `Cancelar`; en un alquiler tambien muestra el boton `Realizar Devolucion` (fuera de alcance), en una venta no.
- Notificacion: `page.getByRole('heading', { name: '¡Transacción exitosa!' | 'Error en la transacción' }).locator('xpath=ancestor::div[contains(@class, "fixed")]')` y `toHaveCSS('opacity', '1')` / `'0'` (con `timeout: 10_000` para la ocultacion). **El `h2` en si siempre tiene opacidad 1; la opacidad que cambia es la del contenedor `fixed`.** Durante el fundido la opacidad pasa por valores intermedios (se observo `0.9`), por eso hay que usar la asercion con reintentos de Playwright y no leer la opacidad una sola vez.
- Fixtures: `api.getStock`, `api.getTransaccionesPorTipo('alquiler')`, `api.getAlquileresPorEstado('alquilado' | 'devuelto')` (cada elemento trae `cliente.cedula` como **numero**), `api.crearAlquiler(titulo, cliente, cant, fechaDev)`, `clienteUnico()` (cedula de 9 digitos), `fechaFutura(dias)` (UTC, formato `YYYY-MM-DD`). Stock: aserciones **relativas** (`const inicial = await api.getStock('E2E Alquiler')` y `expect.poll(() => api.getStock('E2E Alquiler')).toBe(inicial - cantidad)`).

## Supuestos / Riesgos

1. **Estado inicial fresco**: backend recien arrancado (BD `gamehub_e2e` recreada con `import.sql` + `e2e-seed.sql`). La exploracion manual de este plan consumio **4 unidades** de `E2E Alquiler` (un alquiler de 3 y una venta de 1; stock actual 96) y dejo 2 transacciones en el historial (cedulas `199887766` y `188776655`). **Reiniciar el backend E2E** antes de ejecutar. Cada prueba parte de un contexto de navegador nuevo (carrito vacio en `localStorage`).
2. **Un solo juego, varios escenarios que tocan su stock**: `playwright.config.ts` usa `fullyParallel: true`, asi que cualquier prueba que **lea o mute** el stock de `E2E Alquiler` debe estar en **el mismo archivo y en el mismo `test.describe` con `test.describe.configure({ mode: 'serial' })`**: `tests/alquiler/alquiler-exitoso.spec.ts` (escenarios 1.1 a 1.6). Eso incluye los escenarios que **no** descuentan stock pero lo comprueban (1.3, 1.4), porque otro worker podria descontarlo entre la lectura y la comprobacion. Los escenarios de la suite 2 **no consultan el stock** (usan una escucha de `page.on('request')` para demostrar que no se envia ningun `POST /api/transacciones`) y por eso pueden correr en paralelo con la suite 1. No repartir los escenarios 1.x en archivos distintos.
3. **Presupuesto de stock de `E2E Alquiler` (inicial 100)**: 1.1 consume **2** unidades; 1.2 consume **1**; 1.3 consume **0**; 1.4 consume **0**; 1.5 consume **1** (alquiler creado por `api.crearAlquiler`); 1.6 consume **1** (idem). Total **5** de 100: con `retries: 2` el peor caso es 15; alcanza para ~20 corridas por arranque del backend. No agregar mas alquileres sobre este juego sin revisar este presupuesto y nunca agotarlo. Tampoco existe devolucion que restituya el stock (el codigo actual no lo hace).
4. **Aislamiento por cedula, no por conteo global**: las suites comparten backend, asi que no se debe afirmar nada sobre el numero total de filas del Historial ni sobre el contador "Alquileres Activos" del dashboard de `/home` (que si sube con cada alquiler: paso de 0 a 1 en la exploracion). Siempre localizar las filas por la cedula de `clienteUnico()`. Los filtros "Alquileres devueltos" pueden listar devoluciones de otros planes: no afirmar que la lista esta vacia, solo que **no contiene** la cedula propia.
5. **Fecha y zona horaria**: `fechaFutura()` usa `toISOString()` (UTC) y el backend valida `@Future` con la fecha del servidor. Usar siempre `fechaFutura(7)` para el caso feliz y `fechaFutura(-3)` para el pasado. El caso "hoy" (1.4) puede ser inestable si la prueba corre cerca de la medianoche UTC (la fecha UTC y la del servidor pueden diferir); documentarlo en el codigo y no afirmar sobre la fecha local del navegador.
6. **Escenarios 1.x en el mismo contexto**: la pagina del carrito conserva el tipo (`alquiler`) y la fecha escrita mientras no se recargue (estado de React en memoria); cada prueba abre una pagina nueva, asi que no hay arrastre entre escenarios, pero dentro de un mismo escenario que haga dos envios hay que volver a elegir tipo y fecha explicitamente.
7. **Fuera de alcance**: devolucion del alquiler (`Realizar Devolucion`, pestana Devoluciones, estado `devuelto`; pertenece al plan con `E2E Devolucion`), alquiler de varios juegos distintos en un mismo carrito, subida de imagenes, validaciones de cedula/telefono (ya cubiertas en `tests/venta/validaciones-cliente.spec.ts`) y alquiler sin fecha (ya cubierto en `tests/venta/carrito-tipo.spec.ts`, H8).

## Hallazgos de la exploracion (posibles bugs / comportamiento observado)

| # | Observacion | Donde se prueba |
|---|---|---|
| A1 | El `input type="date"` de la fecha de devolucion **no tiene `min`** (ni `max`, ni `required`): la UI permite elegir una fecha pasada o la de hoy. El backend la rechaza con **HTTP 400** `{"message":"Errores de validación","data":{"fechaDev":"must be a future date"}}`. **POSIBLE BUG (validacion solo en backend).** | 1.3, 1.4 |
| A2 | Ante el 400 la UI solo muestra el mensaje **generico** "Error en la transacción / No se pudo procesar la transacción. Por favor verifica los datos e intenta nuevamente." No dice que la fecha de devolucion es el problema aunque el backend lo informa por campo. **POSIBLE BUG de usabilidad.** Tras el error el modal se cierra, el carrito, el tipo y los datos del formulario se conservan. | 1.3, 1.4 |
| A3 | La fecha de **hoy** tambien se rechaza (`@Future` exige estrictamente posterior a hoy). La UI no lo advierte y un alquiler "para hoy" no es posible. Documentar como regla de negocio no comunicada. | 1.4 |
| A4 | Tras un alquiler exitoso el formulario y el carrito se vacian, pero el **tipo sigue en "Alquiler" y el campo "Fecha de devolución" conserva la fecha anterior** (p. ej. `2026-11-02`) mientras no se recargue la pagina. Un segundo alquiler en la misma sesion reutilizaria la fecha vieja sin que el usuario la vea reiniciada. | 1.1 |
| A5 | El modal "Confirmar Transacción" de un alquiler muestra tipo, `cantidad: N x 40000`, `subtotal`, `TOTAL` y `Cantidad de items`, pero **no muestra la fecha de devolucion** elegida (si aparece en el detalle del Historial como "Fecha de Devolución"). | 2.3, 1.1 |
| A6 | Si se elige "Alquiler", se escribe una fecha y se vuelve a "Venta", el campo desaparece y el `POST` se envia con `tipo: "venta"` y `fechaDev: null`; el backend la registra con `estado: "vendido"` y el Historial muestra "Fecha de Devolución = N/A". La fecha escrita no se filtra a la venta (comportamiento correcto). | 1.2 |
| A7 | El estado del tipo (`typeOfTransaction`) **no se persiste**: tras recargar `/cart` el radio vuelve a "Venta" y el total a `3 x 150000 = $450000`; el carrito (`cart_games`, `cart_transJuegos`) y la cantidad (3) **si se conservan**. Si el usuario no se da cuenta, puede vender por error lo que queria alquilar. | 2.2 |
| A8 | La notificacion de exito/error esta **siempre en el DOM**: hay que afirmar la opacidad del contenedor `fixed` (no del `h2`), con valores intermedios durante la transicion (se vio `0.9`). Se oculta sola ~5 s despues y mientras esta visible `Finalizar Transaccion` queda deshabilitado. | 1.1, 1.3, 1.4 |
| A9 | En la pestana Alquileres, con el filtro "Alquileres devueltos" sin resultados, la tabla muestra el estado vacio "Nada por aquí / Historial de alquiler sin registros!". El filtro de estado vuelve a `todos` al cambiar de pestana. Tras recargar `/history` la pestana activa vuelve a "Ventas" (no se persiste). | 1.6 |
| A10 | El contador "Alquileres Activos" del dashboard de `/home` se incrementa con cada alquiler (global, compartido entre pruebas): no es fiable para aserciones absolutas en paralelo. | Supuesto 4 |
| A11 | El backend responde `transJuegos: null` en la respuesta del `POST /api/transacciones`; las lineas del alquiler solo se ven en `GET /api/transacciones/type/alquiler` o en el detalle del Historial. | 1.1 |
| A12 | Al volver a la pestana Alquileres tras pasar por Ventas, el filtro de estado muestra "Todos los alquileres" pero la consulta sigue usando el estado anterior (`devuelto`): la lista no coincide con el filtro visible. Causa: `handleTab` (`History.jsx`) reinicia `date` pero no `rentalFilter`, y el `<select>` es no controlado (`defaultValue`). **POSIBLE BUG.** | 1.6 |

## Tabla de trazabilidad

| Requisito | Escenarios |
|---|---|
| RN-01 (stock disminuye) | 1.1, 1.2, 1.3, 1.4 |
| RN-04 (cliente asociado/creado) | 1.1 |
| RN-05 (total = cantidad x precio de alquiler) | 1.1, 2.1, 2.2, 2.3 |
| RN-06 (queda en el historial, pestana Alquileres) | 1.1, 1.5, 1.6 |
| RN-07 (estado `alquilado`) | 1.1, 1.5, 1.6 |
| RN-08 (fecha de devolucion) | 1.1, 1.2, 1.3, 1.4, 1.5 |
| VAL-04 (sin fecha no se envia) | cubierto en `tests/venta/carrito-tipo.spec.ts` (3.6), no se repite |

## Test Scenarios

### 1. 1. Alquileres que tocan el stock de E2E Alquiler (un unico archivo, describe serial)

**Seed:** `tests/seed.spec.ts`

#### 1.1. 1.1 Alquiler exitoso descuenta stock y queda en el historial con su fecha de devolucion

**File:** `tests/alquiler/alquiler-exitoso.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-01, RN-04, RN-05, RN-06, RN-07, RN-08. Videojuego `E2E Alquiler` (stock 100 en arranque fresco, precio alquiler 40000, venta 150000). Consume **2** unidades. Carrito vacio, tipo por defecto Venta. Preparar `const cliente = clienteUnico()`, `const fechaDev = fechaFutura(7)` y `const inicial = await api.getStock('E2E Alquiler')`.
    - expect: Criterio de exito: todas las aserciones siguientes se cumplen.
    - expect: Criterio de fallo: stock final distinto de `inicial - 2`, total mostrado distinto de $80000, ausencia del alquiler en la pestana Alquileres, estado distinto de `alquilado`, fecha de devolucion distinta de la elegida, o notificacion que no llega a opacidad 1.
  2. Ir a `/home` (seed). En la tarjeta `E2E Alquiler` pulsar 1 vez `+` (name '+', exact) y luego `Agregar E2E Alquiler al carrito`; navegar con el enlace `Carrito` (`/cart`).
    - expect: El `spinbutton` de la tarjeta muestra 2 antes de agregar y `data-stock` es `Stock: <inicial>`.
    - expect: En /cart se ve el encabezado `E2E Alquiler` y el boton `Eliminar E2E Alquiler del carrito`.
    - expect: Resumen por defecto: Videojuegos = 1, Tipo = venta, Total = `$300000` (2 x 150000).
  3. Seleccionar el radio `Alquiler` (`getByRole('radio', { name: 'Alquiler' })`) y escribir `fechaDev` en `getByLabel('Fecha de devolución')` con `fill`.
    - expect: El radio `Alquiler` esta marcado; Tipo = alquiler.
    - expect: El campo `Fecha de devolución` es visible y su valor es `fechaDev`.
    - expect: Total = `$80000` (2 x 40000); la linea del carrito muestra el precio unitario `$40000` (igual que H3 de venta).
  4. Llenar el formulario con `getByLabel`: Cedula = cliente.cedula, Nombre = cliente.nombre, Apellidos = cliente.apellido, Direccion = cliente.direccion, Telefono = cliente.telefono. Pulsar `Finalizar Transaccion`.
    - expect: Sin mensajes de validacion; se abre el modal 'Confirmar Transacción' con la cedula y el telefono del cliente, 'Tipo de Transaccion' = alquiler, `E2E Alquiler`, `cantidad: 2 x 40000`, subtotal 80000, TOTAL 80000 y 'Cantidad de items' 2.
    - expect: OBSERVADO (A5): el modal NO muestra la fecha de devolucion. Anotar con `test.info().annotations`.
  5. Pulsar `Confirmar transaccion` y capturar la respuesta con `page.waitForResponse` sobre `POST /api/transacciones`.
    - expect: La respuesta es 201 con `data.tipo = 'alquiler'`, `data.estado = 'alquilado'`, `data.total = 80000`, `data.fechaDev = fechaDev` y la cedula del cliente (A11: `transJuegos` viene `null` en la respuesta).
    - expect: La notificacion (contenedor `fixed` del heading '¡Transacción exitosa!') llega a `toHaveCSS('opacity','1')` y muestra 'La transacción se ha procesado correctamente.' (no usar solo `toBeVisible`).
    - expect: El modal se cierra (`Confirmar transaccion` con `toBeHidden()`).
    - expect: El carrito queda vacio: 'El carrito esta vacio', Videojuegos = 0, Total = `$0`; el formulario queda vacio; `Finalizar Transaccion` esta deshabilitado.
    - expect: OBSERVADO (A4): el radio `Alquiler` sigue marcado (Tipo = alquiler) y el campo `Fecha de devolución` conserva `fechaDev`. Documentar con `test.info().annotations`; no es necesariamente un bug.
  6. Verificar el stock y el estado por API: `expect.poll(() => api.getStock('E2E Alquiler'))` y `api.getAlquileresPorEstado('alquilado')`.
    - expect: El stock es exactamente `inicial - 2`.
    - expect: `getAlquileresPorEstado('alquilado')` contiene un alquiler cuyo `cliente.cedula` (numero) coincide con `Number(cliente.cedula)`, con `total` 80000 y `fechaDev` = `fechaDev`.
  7. Ir a `Historial` (`/history`), pulsar `getByRole('tab', { name: 'Alquileres' })` y localizar la fila `getByRole('row').filter({ hasText: cliente.cedula })`.
    - expect: La pestana `Alquileres` tiene `aria-selected=true` y `Ventas` `false`.
    - expect: Existe exactamente una fila con la cedula del cliente, con tipo `alquiler`, total `$80000`, la fecha de hoy, la columna 'Fecha Devolución' = `fechaDev` y 'Estado' = `alquilado`.
  8. Pulsar `getByRole('img', { name: 'Ver detalles' })` de esa fila.
    - expect: El detalle ('Detalle de la Transacción') muestra el nombre 'Cliente E2E ####', `E2E Alquiler`, `cantidad: 2 x 40000`, TOTAL 80000, 'Tipo de Transaccion' = alquiler y 'Fecha de Devolución' = `fechaDev` (en una venta es 'N/A').
    - expect: Aparece el boton `Realizar Devolucion` (no se pulsa: fuera de alcance). Cerrar con `Cancelar`.
  9. Esperar a que la notificacion se oculte (volver a `/cart` antes del paso 5 no es necesario; si se permanece en `/cart`, comprobarlo antes de navegar).
    - expect: Si se permanecio en /cart, el contenedor `fixed` vuelve a `toHaveCSS('opacity','0', { timeout: 10_000 })`.

#### 1.2. 1.2 Alquiler con fecha elegida y luego cambiado a Venta se registra como venta sin fecha de devolucion

**File:** `tests/alquiler/alquiler-exitoso.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-05, RN-07, RN-08 (borde del selector de tipo). Videojuego `E2E Alquiler`, consume **1** unidad (cantidad por defecto). `const cliente = clienteUnico()`, `inicial = await api.getStock('E2E Alquiler')`. Registrar los `POST /api/transacciones` con `page.waitForRequest`.
    - expect: Criterio de exito: la transaccion se registra como `venta` con `fechaDev` nulo, total 150000 y estado `vendido`; el stock baja 1.
    - expect: Criterio de fallo: se envia `tipo: 'alquiler'`, se envia una fecha o el total sale como 40000.
  2. En `/home` pulsar `Agregar E2E Alquiler al carrito` y navegar a `Carrito`. Seleccionar `Alquiler`, escribir `fechaFutura(5)` en `Fecha de devolución` y volver a seleccionar `Venta`.
    - expect: Tras volver a Venta el campo `Fecha de devolución` desaparece (`toBeHidden()`), Tipo = venta, Total = `$150000`.
  3. Llenar el formulario con `cliente`, pulsar `Finalizar Transaccion` y `Confirmar transaccion`.
    - expect: El modal muestra 'Tipo de Transaccion' = venta y `cantidad: 1 x 150000`.
    - expect: El cuerpo de la peticion tiene `tipo: 'venta'` y `fechaDev: null` (A6); la respuesta es 201 con `estado: 'vendido'`.
    - expect: La notificacion llega a `opacity` 1 y el carrito queda vacio.
  4. Verificar stock e historial.
    - expect: `expect.poll(() => api.getStock('E2E Alquiler'))` es `inicial - 1`.
    - expect: En `/history`, pestana `Ventas`, hay una fila con la cedula del cliente, tipo `venta`, total `$150000`; su detalle muestra 'Fecha de Devolución' = N/A.
    - expect: En la pestana `Alquileres` NO existe ninguna fila con esa cedula.

#### 1.3. 1.3 Una fecha de devolucion pasada es rechazada por el backend (POSIBLE BUG)

**File:** `tests/alquiler/alquiler-exitoso.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-08 (A1, A2). Videojuego `E2E Alquiler`; consume **0** unidades (el envio se rechaza). `const cliente = clienteUnico()`, `inicial = await api.getStock('E2E Alquiler')`, `fechaPasada = fechaFutura(-3)`. Contar los `POST /api/transacciones`.
    - expect: Criterio de exito: el backend responde 400, la UI informa el error, el stock no cambia, no hay alquiler en el Historial y el carrito se conserva.
    - expect: Criterio de fallo: el alquiler se registra, cambia el stock o se pierde el carrito.
  2. En `/home` agregar `E2E Alquiler` (cantidad 1) y abrir `Carrito`. Seleccionar `Alquiler` y escribir `fechaPasada` en `Fecha de devolución`. Llenar el formulario con `cliente`.
    - expect: OBSERVADO (A1): el campo acepta la fecha pasada (valor = `fechaPasada`) y no hay `min` ni mensaje de validacion; `getByLabel('Fecha de devolución')` tiene `min` vacio.
    - expect: Total = `$40000`.
  3. Pulsar `Finalizar Transaccion`; el modal se abre. Pulsar `Confirmar transaccion` esperando `page.waitForResponse` del `POST /api/transacciones`.
    - expect: El modal 'Confirmar Transacción' se abre con `cantidad: 1 x 40000` (el frontend no valida la fecha).
    - expect: La respuesta es **HTTP 400** con `message: 'Errores de validación'` y `data.fechaDev` = 'must be a future date'.
    - expect: La notificacion 'Error en la transacción' (contenedor `fixed`) llega a `toHaveCSS('opacity','1')` con el texto 'No se pudo procesar la transacción. Por favor verifica los datos e intenta nuevamente.'
    - expect: OBSERVADO (A2): el mensaje es generico y no menciona la fecha de devolucion. Documentar como POSIBLE BUG.
  4. Verificar el estado tras el error.
    - expect: El modal se cierra (`Confirmar transaccion` con `toBeHidden()`).
    - expect: `expect.poll(() => api.getStock('E2E Alquiler'))` sigue siendo `inicial`.
    - expect: El carrito aun contiene `E2E Alquiler` (Total `$40000`, boton `Eliminar E2E Alquiler del carrito`), el radio `Alquiler` sigue marcado y los campos Cedula y `Fecha de devolución` conservan sus valores.
    - expect: `api.getAlquileresPorEstado('alquilado')` no contiene la cedula del cliente.
    - expect: Pasados ~5 s el contenedor vuelve a `opacity` 0 (`timeout: 10_000`).

#### 1.4. 1.4 La fecha de devolucion de hoy tambien es rechazada (POSIBLE BUG de comunicacion)

**File:** `tests/alquiler/alquiler-exitoso.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-08 (A3). Videojuego `E2E Alquiler`; consume **0** unidades. `const cliente = clienteUnico()`, `inicial = await api.getStock('E2E Alquiler')`, `hoy = fechaFutura(0)`. Ver Supuesto 5 sobre la medianoche UTC.
    - expect: Criterio de exito: el backend responde 400 por `fechaDev` no futura y no se crea el alquiler.
    - expect: Criterio de fallo: el alquiler se crea con fecha de hoy (si el producto decide permitirlo, actualizar este escenario).
  2. En `/home` agregar `E2E Alquiler` (cantidad 1), abrir `Carrito`, seleccionar `Alquiler`, escribir `hoy` en `Fecha de devolución` y llenar el formulario con `cliente`. Pulsar `Finalizar Transaccion` y `Confirmar transaccion` esperando la respuesta del `POST`.
    - expect: El modal se abre (la UI no valida la fecha).
    - expect: La respuesta es HTTP 400 con `data.fechaDev` = 'must be a future date'.
    - expect: La notificacion 'Error en la transacción' llega a `opacity` 1.
  3. Corregir la fecha: sin recargar, escribir `fechaFutura(1)` en `Fecha de devolución` y comprobar el estado (NO volver a confirmar, para no consumir stock).
    - expect: `expect.poll(() => api.getStock('E2E Alquiler'))` sigue siendo `inicial`.
    - expect: El carrito y el formulario se conservan, de modo que el usuario podria reintentar con una fecha valida sin reescribir sus datos.
    - expect: Documentar con `test.info().annotations`: 'A3: un alquiler con devolucion el mismo dia no es posible y la UI no lo avisa'.

#### 1.5. 1.5 La pestana Alquileres muestra columnas extra y separa alquileres de ventas

**File:** `tests/alquiler/alquiler-exitoso.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-06, RN-07, RN-08. Videojuego `E2E Alquiler`; consume **1** unidad (alquiler creado por API como precondicion, sin pasar por el carrito). `const cliente = clienteUnico()`, `const fechaDev = fechaFutura(10)`, `await api.crearAlquiler('E2E Alquiler', cliente, 1, fechaDev)`.
    - expect: Criterio de exito: el alquiler solo aparece en la pestana Alquileres, con las columnas extra y los valores correctos.
    - expect: Criterio de fallo: aparece en Ventas, faltan las columnas o la fecha/estado son distintos.
  2. Abrir `/history` y comprobar la pestana por defecto con `getByRole('tab', { name: 'Ventas' })`.
    - expect: `Ventas` tiene `aria-selected=true` y `Alquileres` `false`.
    - expect: Las cabeceras (`getByRole('columnheader')`) son exactamente: 'Fecha y Hora', 'Cédula Cliente', 'Tipo', 'Total', 'Acciones' (sin 'Fecha Devolución' ni 'Estado').
    - expect: NO existe ninguna fila con la cedula del cliente en Ventas.
  3. Pulsar `getByRole('tab', { name: 'Alquileres' })`.
    - expect: `Alquileres` tiene `aria-selected=true` y `Ventas` `false`.
    - expect: Las cabeceras son: 'Fecha y Hora', 'Cédula Cliente', 'Tipo', 'Total', 'Fecha Devolución', 'Estado', 'Acciones'.
    - expect: Existe una fila con la cedula del cliente, tipo `alquiler`, total `$40000`, 'Fecha Devolución' = `fechaDev` y 'Estado' = `alquilado`.
  4. Usar el filtro `getByLabel('Filtrar por fecha')`: escribir la fecha de hoy y luego `2020-01-01`.
    - expect: Con la fecha de hoy (UTC, `fechaFutura(0)`) la fila del cliente sigue presente; con `2020-01-01` ya no esta (la tabla queda sin filas de datos).
  5. Recargar la pagina (`page.reload()`).
    - expect: La pestana activa vuelve a `Ventas` (no se persiste) y el alquiler sigue sin aparecer alli (A9).

#### 1.6. 1.6 El filtro de estado: Alquileres Activos lista el alquiler nuevo y Alquileres devueltos no

**File:** `tests/alquiler/alquiler-exitoso.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-06, RN-07. Videojuego `E2E Alquiler`; consume **1** unidad (alquiler creado por `api.crearAlquiler('E2E Alquiler', cliente, 1)`). `const cliente = clienteUnico()`. No se devuelve el alquiler (la devolucion esta fuera de alcance).
    - expect: Criterio de exito: el alquiler solo aparece con los filtros 'Todos' y 'Activos'.
    - expect: Criterio de fallo: aparece en 'devueltos' o falta en 'activos'.
  2. Abrir `/history`, pulsar `getByRole('tab', { name: 'Alquileres' })` y leer `getByLabel('Filtrar alquileres por estado')`.
    - expect: El filtro esta visible, su valor inicial es `todos` y tiene las opciones 'Todos los alquileres', 'Alquileres Activos', 'Alquileres devueltos' (`locator('option')`).
    - expect: La fila de la cedula del cliente esta presente con 'Estado' = `alquilado`.
  3. Con `selectOption({ label: 'Alquileres Activos' })`.
    - expect: La fila con la cedula del cliente esta presente, con 'Estado' = `alquilado`.
  4. Con `selectOption({ label: 'Alquileres devueltos' })`.
    - expect: `getByRole('row').filter({ hasText: cliente.cedula })` tiene 0 elementos (usar `toHaveCount(0)`; no afirmar que la tabla esta vacia, ver Supuesto 4). Si la lista queda vacia se ve 'Historial de alquiler sin registros!' (A9).
  5. Volver a `selectOption({ label: 'Todos los alquileres' })`, cambiar a la pestana `Ventas` y de regreso a `Alquileres`.
    - expect: Con 'Todos' la fila vuelve a aparecer.
    - expect: OBSERVADO (A9): al volver a la pestana Alquileres el filtro queda en `todos`.
    - expect: Por API, `api.getAlquileresPorEstado('alquilado')` contiene la cedula y `api.getAlquileresPorEstado('devuelto')` no.

### 2. 2. Carrito de alquiler sin transacciones completadas (no leen el stock; paralelizables)

**Seed:** `tests/seed.spec.ts`

#### 2.1. 2.1 El tipo de transaccion determina el precio: Alquiler usa 40000 y Venta 150000

**File:** `tests/alquiler/carrito-tipo-alquiler.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-05. Videojuego `E2E Alquiler` (venta 150000, alquiler 40000); no consume stock ni envia nada. En `/home` pulsar `+` 2 veces (cantidad 3), `Agregar E2E Alquiler al carrito` y navegar a `Carrito`.
    - expect: Criterio de exito: el total depende del tipo seleccionado y el campo de fecha aparece solo con Alquiler.
    - expect: Criterio de fallo: el total no cambia al alternar o el campo de fecha no aparece/desaparece.
  2. Verificar el estado por defecto.
    - expect: El radio `Venta` esta marcado; Tipo = venta; Total = `$450000` (3 x 150000); `getByLabel('Fecha de devolución')` esta oculto (`toBeHidden()`).
  3. Seleccionar el radio `Alquiler`.
    - expect: Tipo = alquiler; Total = `$120000` (3 x 40000); la linea del carrito muestra `$40000`.
    - expect: El campo `Fecha de devolución` es visible, de tipo `date`, vacio y sin atributo `min` (A1).
    - expect: Videojuegos sigue en 1.
  4. Volver a seleccionar el radio `Venta`.
    - expect: Tipo = venta; Total = `$450000`; la linea muestra `$150000`; el campo `Fecha de devolución` desaparece.
    - expect: El boton `Eliminar E2E Alquiler del carrito` sigue presente (el carrito no se altero).
  5. Comprobar que no se envio ninguna peticion.
    - expect: Ningun `POST /api/transacciones` fue registrado con `page.on('request')` durante toda la prueba.

#### 2.2. 2.2 Recargar /cart devuelve el tipo a Venta pero conserva los juegos y la cantidad

**File:** `tests/alquiler/carrito-tipo-alquiler.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-05 (A7). Videojuego `E2E Alquiler`; no consume stock ni envia nada. Agregar `E2E Alquiler` con cantidad 3 (dos pulsaciones de `+`), abrir `/cart` y seleccionar `Alquiler`.
    - expect: Criterio de exito: tras recargar el tipo vuelve a Venta y el carrito se conserva.
    - expect: Criterio de fallo: el carrito se pierde o el tipo se conserva (en ese caso actualizar el escenario).
  2. Escribir una fecha en `Fecha de devolución` (`fechaFutura(7)`) y verificar el estado.
    - expect: Tipo = alquiler, Total = `$120000`, el campo de fecha tiene valor.
  3. Recargar la pagina (`page.reload()`).
    - expect: El radio `Venta` esta marcado, Tipo = venta y Total = `$450000` (3 x 150000): la cantidad 3 se conserva (A7).
    - expect: El campo `Fecha de devolución` no existe (`toBeHidden()`) y el boton `Eliminar E2E Alquiler del carrito` sigue presente; Videojuegos = 1.
    - expect: `localStorage.cart_games` contiene `E2E Alquiler` y `localStorage.cart_transJuegos` tiene `cant: 3`; no hay ninguna clave de tipo de transaccion en `localStorage` (solo `token`, `cart_games`, `cart_transJuegos`).
    - expect: Documentar con `test.info().annotations`: el tipo no se persiste y el usuario podria vender por error lo que queria alquilar.
  4. Volver a seleccionar `Alquiler` tras la recarga.
    - expect: Total = `$120000` y el campo `Fecha de devolución` reaparece vacio (la fecha anterior se perdio).

#### 2.3. 2.3 Cancelar la confirmacion de un alquiler de 3 unidades no envia nada y conserva el carrito

**File:** `tests/alquiler/carrito-tipo-alquiler.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-05, RN-08 (A5). Videojuego `E2E Alquiler`; no consume stock (se cancela siempre; no se lee el stock: se vigila que no salga ningun `POST /api/transacciones`). `const cliente = clienteUnico()`, `const fechaDev = fechaFutura(7)`. Agregar `E2E Alquiler` con cantidad 3 y abrir `/cart`.
    - expect: Criterio de exito: tras cancelar nada cambia y no se envia ninguna peticion de transaccion.
    - expect: Criterio de fallo: se envia un `POST`, el carrito se vacia o se pierden los datos del formulario.
  2. Seleccionar `Alquiler`, escribir `fechaDev` y llenar el formulario con `cliente`. Pulsar `Finalizar Transaccion`.
    - expect: Se abre el modal 'Confirmar Transacción' con 'Tipo de Transaccion' = alquiler, `cantidad: 3 x 40000`, subtotal 120000, TOTAL 120000 y 'Cantidad de items' 3.
    - expect: OBSERVADO (A5): el modal no muestra la fecha de devolucion elegida.
  3. Pulsar `Cancelar`.
    - expect: El boton `Confirmar transaccion` queda oculto (`toBeHidden()`).
    - expect: El carrito conserva `E2E Alquiler`, Tipo = alquiler, Total = `$120000`, y `Fecha de devolución` y los campos del formulario conservan sus valores.
    - expect: La notificacion (contenedor `fixed`) sigue en `opacity` 0 (no hubo exito ni error).
    - expect: No se registro ningun `POST /api/transacciones`.
  4. Abrir `/history`, pestana `Alquileres`, y buscar la cedula del cliente.
    - expect: No existe ninguna fila con esa cedula (`toHaveCount(0)`).
