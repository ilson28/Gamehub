# Plan de pruebas E2E - Flujo de venta de GameHub

## Application Overview

## Alcance

Plan de pruebas E2E del **flujo de venta** de GameHub (catálogo `/home` -> carrito `/cart` -> modal "Confirmar Transacción" -> notificación -> `/history`). La aplicación está en español. Insumo principal: `specs/requisitos-venta.md` (RN-01, RN-03, RN-04, RN-05, RN-06, VAL-01, VAL-02, VAL-03). Los casos borde de este plan se **verificaron manualmente** contra la app corriendo (frontend :5174, backend perfil `e2e` :8090); cuando el comportamiento observado difiere de lo esperado se anota como **COMPORTAMIENTO OBSERVADO / POSIBLE BUG**.

Seed de referencia: `tests/seed.spec.ts` (importa `test`/`expect` de `fixtures/gamehub.ts`, abre `/home` ya autenticada con el JWT en `localStorage["token"]` y comprueba el encabezado "Gestión de Videojuegos" y la tarjeta "E2E Venta"). **No se inicia sesión por la UI.** Todas las pruebas deben importar de `../../fixtures/gamehub`.

## Datos de prueba (e2e-seed.sql)

| Videojuego | Stock inicial | Precio venta | Uso en este plan |
|---|---|---|---|
| `E2E Venta` | 100 | 200000 | Ventas reales que descuentan stock (suite 1) |
| `E2E Validaciones` | 10 | 180000 | Pruebas que NO completan la venta (suites 2 y 3) |
| `E2E Agotado` | 0 | 120000 | Juego sin stock (suite 4) |
| `E2E Alquiler` | 10 | 150000 | **NO USAR**: reservado para el flujo de alquiler |

## Convenciones y selectores (todos verificados)

- Tarjeta: `page.getByTestId('game-card').filter({ has: page.getByRole('heading', { name: <titulo> }) })`; el stock está en su atributo `data-stock` (texto `"Stock: N"`).
- Botones de tarjeta: `getByRole('button', { name: 'Agregar <titulo> al carrito' })`, `getByRole('link', { name: 'Editar <titulo>' })`, y botones de cantidad `getByRole('button', { name: '+', exact: true })` / `{ name: '-', exact: true }`. La cantidad es `getByRole('spinbutton')` dentro de la tarjeta y es **de solo lectura** (`readOnly`): no se puede `fill`, solo se cambia con "+"/"-".
- Carrito: `getByRole('button', { name: 'Eliminar <titulo> del carrito' })`; radios `getByRole('radio', { name: 'Venta' | 'Alquiler' })`; formulario `getByLabel('Cedula' | 'Nombre' | 'Apellidos' | 'Direccion' | 'Telefono')`; botón `getByRole('button', { name: 'Finalizar Transaccion' })`; el resumen muestra "Videojuegos", "Tipo" y "Total" (`getByText('Total', { exact: true })` + hermano `<p>`).
- Modal de confirmación: título "Confirmar Transacción"; botones `Cancelar` y `Confirmar transaccion` (nota: sin tilde y con "t" minúscula). Contiene cédula, teléfono, nombre, dirección, tipo, `cantidad: N x PRECIO`, `subtotal`, `TOTAL` y `Cantidad de items`.
- Mensajes de validación: "La cedula es obligatoria", "El nombre es obligatorio", "El apellido es obligatorio", "La direccion es obligatoria", "El telefono es obligatorio", "Debe tener minimo 7 digitos", "Debe tener 10 digitos". El formulario valida al salir del campo (`blur`) y al enviar.
- Historial `/history`: la pestaña "Ventas" está activa por defecto (las pestañas son `div`, no `role=tab`: usar `getByText('Ventas', { exact: true })`); filas `getByRole('row').filter({ hasText: <cedula> })`; columnas Fecha y Hora / Cédula Cliente / Tipo / Total / Acciones; el icono `getByRole('img', { name: 'Ver detalles' })` abre el detalle; el único filtro es un `input[type=date]` sin etiqueta.
- Cliente: `clienteUnico()` para **toda** venta que se complete. Stock: aserciones **relativas**: `const inicial = await api.getStock(titulo)` y luego `expect.poll(() => api.getStock(titulo)).toBe(inicial - cantidad)`.

### Trampa de falsos positivos (importante)

La notificación "¡Transacción exitosa!" / "Error en la transacción" (`h2` dentro de un contenedor `fixed`, **sin `role="alert"`**) está **siempre presente en el DOM** y se oculta con `opacity-0` + `translate-x`. Por eso `toBeVisible()` pasa incluso antes de vender. Verificarla con `toHaveCSS('opacity', '1')` (y `toHaveCSS('opacity', '0')` para "oculta"); la notificación se oculta sola a los 5 s y mientras está visible el botón "Finalizar Transaccion" queda deshabilitado. El modal "Confirmar Transacción" tampoco debe comprobarse con `count()` (queda 1 nodo tras cerrarse): usar `toBeHidden()` / `not.toBeVisible()` sobre el botón `Confirmar transaccion`.

## Supuestos / Riesgos

1. **Estado inicial fresco**: backend recién arrancado (BD `gamehub_e2e` recreada con `import.sql` + `e2e-seed.sql`). La exploración manual de este plan consumió 4 unidades de `E2E Venta` (stock actual 6); **reiniciar el backend E2E** antes de ejecutar. Cada prueba parte de un contexto de navegador nuevo (`localStorage` del carrito vacío) y el carrito persiste en `localStorage` (`cart_games`, `cart_transJuegos`) solo dentro de ese contexto.
2. **Limitación de `E2E Venta` en paralelo**: `playwright.config.ts` usa `fullyParallel: true`. Solo la suite 1 muta el stock de `E2E Venta`; sus 3 escenarios deben ejecutarse **en el mismo worker y en serie** (agruparlos en un único `test.describe` con `test.describe.configure({ mode: 'serial' })`, o equivalente, dentro de `tests/venta/venta-exitosa.spec.ts`). Si se ejecutaran en paralelo, la aserción relativa `inicial - cantidad` puede fallar porque otro worker descuenta stock entre la lectura y la comprobación. Ninguna otra suite ni el flujo de alquiler debe tocar `E2E Venta`.
3. **Presupuesto de stock de `E2E Venta` (inicial 100)**: Escenario 1.1 consume **2** unidades; 1.2 consume **1**; 1.3 consume **2** (1 + 1). Total **5** de 100: alcanza para unas 20 corridas por arranque del backend, incluidos los reintentos en CI (`retries: 2`), que en el peor caso consumen 15. Mantener los escenarios con cantidades mínimas y no añadir más ventas sobre `E2E Venta` sin revisar este presupuesto. No se debe vender hasta agotar el stock (eso rompería el resto de escenarios en el mismo arranque).
4. **`E2E Validaciones` compartido entre las suites 2 y 3**: es una excepción documentada a "un juego por escenario". Ningún escenario de esas suites completa una venta (todos terminan bloqueados por validación, cancelados, eliminados o rechazados por el backend sin descontar stock), por lo que el stock queda en 10 y son independientes y paralelizables. Si alguno llegara a completar una venta, deja de ser válido compartir el juego.
5. **Fixture `getTransaccionesDeCliente` probablemente incorrecto**: `GET /api/transacciones/cliente/{cedula}` devuelve un **arreglo plano** (`ResponseEntity<List<TransaccionResponseDto>>`, sin el sobre `ApiResponse`), mientras que el fixture lee `.data` y devolvería `undefined`. Hasta corregirlo (fuera del alcance de este plan), verificar las transacciones del cliente por la UI de Historial, o tratar la respuesta como arreglo plano.
6. Fuera de alcance: venta con varios juegos distintos en el mismo carrito (exigiría mutar dos juegos del seed), flujo de alquiler (`E2E Alquiler`), devoluciones (RN-02 no implementado) y subida de imágenes.

## Hallazgos de la exploración (posibles bugs / comportamiento observado)

| # | Observación | Dónde se prueba |
|---|---|---|
| H1 | La notificación de éxito/error está siempre en el DOM (falso positivo con `toBeVisible`). | Escenarios 1.1, 3.8 |
| H2 | Un videojuego ya presente en el carrito **no se actualiza** al volver a agregarlo con otra cantidad: conserva la cantidad inicial y no avisa al usuario. | 3.1 |
| H3 | La línea del carrito muestra el precio **unitario** (p. ej. `$180000` para 3 unidades) y no la cantidad; solo el modal de confirmación muestra `cantidad: N x precio`. | 3.1 |
| H4 | Cédula **negativa** (`-1234567`), **decimal** (`1234567.5`) y notación científica (`1e9`) pasaban la validación del formulario (el modal de confirmación se abría). **Corregido** en `form-client.model.js` (la cédula debe ser solo dígitos: "Cedula invalida: solo se permiten digitos"). | 2.7 |
| H5 | **RESUELTO: el formulario rechaza cédulas mayores que 2147483647 (máximo del Integer del backend) y la prueba lo comprueba.** Hallazgo original: Cédula de **11 dígitos** pasa la validación del frontend, pero `POST /api/transacciones` responde **500** (desborda `Integer`); la UI muestra "Error en la transacción" (mensaje genérico). Esperado: validación en el formulario (VAL-01 solo fija el mínimo). | 3.7 |
| H6 | Cédula con ceros a la izquierda se normaliza con `Number()`: `0123456` (7 caracteres) falla con "Debe tener minimo 7 digitos"; `01234567` pasa. Igual con teléfono `0300000000` (falla "Debe tener 10 digitos"). | 2.4, 2.5 |
| H7 | Si la cédula ya existe, la venta se asocia al cliente existente y **no actualiza** sus datos (nombre, dirección, teléfono del segundo envío se ignoran). Coherente con "se crea si no existe" (RN-04), pero conviene documentarlo. | 1.3 |
| H8 | En "Alquiler", "Finalizar Transaccion" sin fecha de devolución no hace nada (no abre el modal ni muestra mensaje alguno). | 3.6 |
| H9 | Con stock 0 el botón "+" sigue habilitado (la cantidad queda en 1) y los botones "+" nunca se deshabilitan al llegar al stock: solo se detiene el incremento. | 3.1 |
| H10 | Fixture `getTransaccionesDeCliente` lee `.data` de una respuesta que es un arreglo plano. | Supuesto 5 |

## Test Scenarios

### 1. 1. Venta exitosa (E2E Venta - muta stock, ejecutar en serie)

**Seed:** `tests/seed.spec.ts`

#### 1.1. 1.1 Venta exitosa descuenta el stock y queda en el historial

**File:** `tests/venta/venta-exitosa.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-01, RN-04, RN-05, RN-06. Videojuego `E2E Venta` (stock 100 en arranque fresco, precio 200000). Consume 2 unidades. Carrito vacío, formulario vacío, tipo por defecto Venta. Preparar `const cliente = clienteUnico()` y `const inicial = await api.getStock('E2E Venta')`.
    - expect: Criterio de éxito: todas las aserciones siguientes se cumplen.
    - expect: Criterio de fallo: el stock final distinto de `inicial - 2`, ausencia de la venta en Historial, carrito con elementos tras confirmar, o notificación no visible (opacity != 1).
  2. Ir a `/home` (seed). En la tarjeta `E2E Venta` pulsar 1 vez el botón `+` (name '+', exact).
    - expect: El `spinbutton` de la tarjeta muestra 2.
    - expect: `data-stock` de la tarjeta es `Stock: <inicial>`.
  3. Pulsar `Agregar E2E Venta al carrito` y luego el enlace de navegación `Carrito` (`/cart`).
    - expect: Se muestra el encabezado `E2E Venta` en 'Videojuegos en el carrito' y existe el botón `Eliminar E2E Venta del carrito`.
    - expect: En Resumen: Videojuegos = 1, Tipo = venta, Total = `$400000` (2 x 200000).
  4. Comprobar que el radio `Venta` está marcado (por defecto) y completar el formulario con `getByLabel`: Cedula = cliente.cedula, Nombre = cliente.nombre, Apellidos = cliente.apellido, Direccion = cliente.direccion, Telefono = cliente.telefono.
    - expect: Sin mensajes de error en el formulario.
    - expect: El Total sigue siendo `$400000`.
  5. Pulsar `Finalizar Transaccion`.
    - expect: Se abre el modal 'Confirmar Transacción' con la cédula y el teléfono del cliente, 'Tipo de Transaccion' = venta, 'E2E Venta', `cantidad: 2 x 200000`, subtotal 400000, TOTAL 400000 y 'Cantidad de items' 2.
  6. Pulsar `Confirmar transaccion`.
    - expect: La notificación con el título '¡Transacción exitosa!' y el texto 'La transacción se ha procesado correctamente.' tiene opacidad 1 (`toHaveCSS('opacity','1')`; no usar solo `toBeVisible`).
    - expect: El modal de confirmación se cierra (botón `Confirmar transaccion` oculto).
    - expect: El carrito queda vacío: se ve 'El carrito esta vacio' y 'Agrega videojuegos desde la pagina de Inicio'; Resumen: Videojuegos = 0, Total = `$0`.
    - expect: El formulario queda vacío (Cedula y Nombre sin valor).
    - expect: `Finalizar Transaccion` está deshabilitado (carrito vacío).
  7. Verificar el stock por API con `expect.poll(() => api.getStock('E2E Venta'))`.
    - expect: El stock es exactamente `inicial - 2`.
  8. Ir a `Historial` (`/history`) con la pestaña 'Ventas' activa y localizar la fila `getByRole('row').filter({ hasText: cliente.cedula })`.
    - expect: Existe exactamente una fila con la cédula del cliente, tipo `venta`, total `$400000` y la fecha de hoy.
    - expect: Pulsando `Ver detalles` en esa fila se ve el detalle con `E2E Venta`, `cantidad: 2 x 200000`, nombre 'Cliente E2E ####' y 'Fecha de Devolución' = N/A.
  9. Esperar ~5 s tras la confirmación (volver a `/cart` o permanecer en ella antes de navegar).
    - expect: La notificación vuelve a opacidad 0 y `Finalizar Transaccion` sigue deshabilitado por carrito vacío.

#### 1.2. 1.2 Venta de cantidad mínima con cédula de 7 dígitos y teléfono de 10 dígitos (límites válidos)

**File:** `tests/venta/venta-exitosa.spec.ts`

**Steps:**
  1. Referencias y estado inicial: VAL-01, VAL-02, RN-01, RN-04. Videojuego `E2E Venta`, consume 1 unidad (cantidad por defecto 1). Preparar `const cliente = clienteUnico()` y reemplazar su cédula por una de exactamente 7 dígitos que NO empiece por 0: `'1' + cliente.cedula.slice(-6)`; el teléfono de `clienteUnico()` ya tiene 10 dígitos. Leer `inicial = await api.getStock('E2E Venta')`.
    - expect: Criterio de éxito: la venta se completa con los valores límite mínimos válidos.
    - expect: Criterio de fallo: aparece 'Debe tener minimo 7 digitos' o 'Debe tener 10 digitos' con valores válidos, o el stock final es distinto de `inicial - 1`.
  2. En `/home` pulsar `Agregar E2E Venta al carrito` sin tocar la cantidad y navegar a `Carrito`.
    - expect: Resumen: Videojuegos = 1, Total = `$200000`.
  3. Llenar el formulario con la cédula de 7 dígitos, nombre, apellido, dirección y el teléfono de 10 dígitos. Pulsar `Finalizar Transaccion`.
    - expect: No se muestra ningún mensaje de validación.
    - expect: Se abre el modal 'Confirmar Transacción' con `cantidad: 1 x 200000` y TOTAL 200000.
  4. Pulsar `Confirmar transaccion`.
    - expect: Notificación '¡Transacción exitosa!' con opacidad 1.
    - expect: Carrito vacío.
    - expect: `expect.poll` del stock da `inicial - 1`.
  5. Abrir `/history` y buscar la fila por la cédula de 7 dígitos.
    - expect: Aparece una venta `venta` por `$200000` con esa cédula.

#### 1.3. 1.3 Segunda venta al mismo cliente reutiliza al cliente existente

**File:** `tests/venta/venta-exitosa.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-04, RN-01, RN-06. Videojuego `E2E Venta`, consume 2 unidades (1 por cada venta). `const cliente = clienteUnico()`; `inicial = await api.getStock('E2E Venta')`. Realizar dos ventas de cantidad 1 con la MISMA cédula.
    - expect: Criterio de éxito: ambas ventas se registran, stock = `inicial - 2`, ambas aparecen en Historial con la misma cédula y los datos del cliente de la primera venta se conservan.
    - expect: Criterio de fallo: la segunda venta falla, la cédula se duplica como cliente distinto o el stock no descuenta 2.
  2. Venta A: en `/home` agregar `E2E Venta` (cantidad 1), ir a Carrito, llenar el formulario con `cliente` completo, `Finalizar Transaccion` y `Confirmar transaccion`.
    - expect: Notificación '¡Transacción exitosa!' con opacidad 1 y carrito vacío.
    - expect: Esperar a que la notificación se oculte (opacidad 0, ~5 s) para que `Finalizar Transaccion` se pueda usar de nuevo.
  3. Venta B: volver a `/home`, agregar `E2E Venta` (cantidad 1), ir a Carrito y llenar el formulario con la MISMA cédula pero con Nombre = 'Otro', Apellidos = 'Distinto', Direccion = 'Calle 2' y otro teléfono de 10 dígitos. `Finalizar Transaccion` y `Confirmar transaccion`.
    - expect: Notificación '¡Transacción exitosa!' con opacidad 1; la venta no es rechazada por cédula repetida.
  4. Verificar el stock por API.
    - expect: `expect.poll(() => api.getStock('E2E Venta'))` es `inicial - 2`.
  5. Abrir `/history` (pestaña Ventas) y filtrar las filas por la cédula.
    - expect: Hay exactamente 2 filas con esa cédula, ambas `venta` por `$200000`.
    - expect: COMPORTAMIENTO OBSERVADO (H7): al abrir `Ver detalles` en la venta B el cliente conserva el nombre/dirección/teléfono de la venta A (los datos del segundo envío no actualizan al cliente existente). Documentar con `test.info().annotations`; no es necesariamente un bug.

### 2. 2. Validaciones del formulario de cliente (E2E Validaciones - no muta stock)

**Seed:** `tests/seed.spec.ts`

#### 2.1. 2.1 Cédula y teléfono inválidos bloquean la venta

**File:** `tests/venta/validaciones-cliente.spec.ts`
    
**Steps:**
  1. Referencias y estado inicial: VAL-01, VAL-02. Videojuego `E2E Validaciones` (stock 10). No consume stock. Carrito vacío. `const inicial = await api.getStock('E2E Validaciones')`.
    - expect: Criterio de éxito: aparecen ambos mensajes, no se abre el modal y el stock no cambia.
    - expect: Criterio de fallo: se abre el modal 'Confirmar Transacción' o el stock cambia.
  2. En `/home` pulsar `Agregar E2E Validaciones al carrito` y navegar a `Carrito`.
    - expect: El carrito muestra `E2E Validaciones` con Total `$180000`.
  3. Llenar Cedula = '123', Telefono = '300', Nombre = 'Cliente', Apellidos = 'E2E', Direccion = 'Cra 51b #79-56'. Pulsar `Finalizar Transaccion`.
    - expect: Se ve 'Debe tener minimo 7 digitos' bajo Cedula y 'Debe tener 10 digitos' bajo Telefono.
    - expect: No hay mensajes de error en Nombre, Apellidos ni Direccion.
    - expect: El botón `Confirmar transaccion` NO es visible (modal no abierto).
  4. Verificar el estado tras el intento.
    - expect: `api.getStock('E2E Validaciones')` sigue siendo `inicial`.
    - expect: El carrito conserva `E2E Validaciones` y los datos escritos en el formulario.

#### 2.2. 2.2 Formulario vacío muestra todos los mensajes de campo obligatorio

**File:** `tests/venta/validaciones-cliente.spec.ts`

**Steps:**
  1. Referencias y estado inicial: VAL-01, VAL-02, VAL-03. Videojuego `E2E Validaciones`; no consume stock. Agregarlo al carrito y abrir `/cart` con el formulario completamente vacío.
    - expect: Criterio de éxito: los 5 mensajes aparecen y no se abre el modal.
    - expect: Criterio de fallo: falta algún mensaje o se abre el modal.
  2. Pulsar `Finalizar Transaccion` sin escribir nada.
    - expect: Se muestran exactamente: 'La cedula es obligatoria', 'El nombre es obligatorio', 'El apellido es obligatorio', 'La direccion es obligatoria' y 'El telefono es obligatorio'.
    - expect: El botón `Confirmar transaccion` no es visible.
    - expect: El stock de `E2E Validaciones` no cambia.
  3. Llenar solo Nombre, Apellidos y Direccion y volver a pulsar `Finalizar Transaccion`.
    - expect: Desaparecen los mensajes de nombre, apellido y dirección; permanecen los de cédula y teléfono; sigue sin abrirse el modal.

#### 2.3. 2.3 Nombre, apellido y dirección solo con espacios se rechazan

**File:** `tests/venta/validaciones-cliente.spec.ts`

**Steps:**
  1. Referencias y estado inicial: VAL-03. Videojuego `E2E Validaciones`; no consume stock. Carrito con el juego, formulario vacío.
    - expect: Criterio de éxito: el espacio en blanco se trata como vacío. Fallo: el modal se abre.
  2. Llenar Cedula = '1234567', Telefono = '3001234567' y escribir '   ' (tres espacios) en Nombre, Apellidos y Direccion. Pulsar `Finalizar Transaccion`.
    - expect: Se muestran 'El nombre es obligatorio', 'El apellido es obligatorio' y 'La direccion es obligatoria'.
    - expect: No hay mensajes en Cedula ni Telefono.
    - expect: El modal no se abre y el stock no cambia.

#### 2.4. 2.4 Límites de la cédula: 6 dígitos falla, 7 dígitos pasa, ceros a la izquierda

**File:** `tests/venta/validaciones-cliente.spec.ts`

**Steps:**
  1. Referencias y estado inicial: VAL-01. Videojuego `E2E Validaciones`; no consume stock. Abrir `/cart` con el juego agregado. Evaluar cada valor en `getByLabel('Cedula')` y salir del campo (`blur`) para ver el mensaje.
    - expect: Criterio de éxito: coincide con la tabla siguiente. Fallo: cualquier discrepancia.
  2. Escribir '123456' (6 dígitos) y hacer blur.
    - expect: Aparece 'Debe tener minimo 7 digitos'.
  3. Escribir '1234567' (7 dígitos) y hacer blur.
    - expect: No aparece mensaje de error en Cedula.
  4. Escribir '0123456' (7 caracteres con cero inicial) y hacer blur.
    - expect: COMPORTAMIENTO OBSERVADO (H6): aparece 'Debe tener minimo 7 digitos' porque el valor se convierte con `Number()` y pierde el cero inicial (queda 123456). Documentar; no se considera necesariamente un bug.
  5. Escribir '01234567' (8 caracteres con cero inicial) y hacer blur.
    - expect: No aparece mensaje (se evalúa como 1234567, 7 dígitos).
  6. Vaciar el campo y hacer blur.
    - expect: Aparece 'La cedula es obligatoria'.

#### 2.5. 2.5 Límites del teléfono: 9 y 11 dígitos fallan, 10 pasa

**File:** `tests/venta/validaciones-cliente.spec.ts`

**Steps:**
  1. Referencias y estado inicial: VAL-02. Videojuego `E2E Validaciones`; no consume stock. Abrir `/cart` con el juego agregado y evaluar `getByLabel('Telefono')` con blur tras cada valor.
    - expect: Criterio de éxito: coincide con los pasos. Fallo: cualquier discrepancia.
  2. Escribir '299999999' (9 dígitos) y hacer blur.
    - expect: Aparece 'Debe tener 10 digitos'.
  3. Escribir '3000000000' (10 dígitos) y hacer blur.
    - expect: No aparece mensaje de error en Telefono.
  4. Escribir '30000000000' (11 dígitos) y hacer blur.
    - expect: Aparece 'Debe tener 10 digitos'.
  5. Escribir '0300000000' (10 caracteres con cero inicial) y hacer blur.
    - expect: COMPORTAMIENTO OBSERVADO (H6): aparece 'Debe tener 10 digitos' porque `Number()` elimina el cero inicial (9 dígitos). Documentar.
  6. Vaciar el campo y hacer blur.
    - expect: Aparece 'El telefono es obligatorio'.

#### 2.6. 2.6 Los campos Cedula y Telefono no aceptan letras

**File:** `tests/venta/validaciones-cliente.spec.ts`

**Steps:**
  1. Referencias y estado inicial: VAL-01, VAL-02. Videojuego `E2E Validaciones`; no consume stock. Abrir `/cart` con el juego agregado. Ambos campos son `<input type=number>`.
    - expect: Criterio de éxito: ningún carácter alfabético queda en el campo. Fallo: el campo conserva las letras.
  2. Teclear con `pressSequentially` 'abc' en `getByLabel('Cedula')` y en `getByLabel('Telefono')`.
    - expect: Ambos campos permanecen vacíos (`inputValue()` = '').
  3. Pulsar `Finalizar Transaccion` con esos campos vacíos.
    - expect: Se muestran 'La cedula es obligatoria' y 'El telefono es obligatorio'; el modal no se abre.

#### 2.7. 2.7 Cédula negativa, decimal o en notación científica no debería aceptarse

**File:** `tests/venta/validaciones-cliente.spec.ts`

**Steps:**
  1. Referencias y estado inicial: VAL-01 (H4, corregido). Videojuego `E2E Validaciones`; no consume stock. Carrito con el juego y Nombre, Apellidos, Direccion y Telefono = '3001234567' válidos. NO confirmar la venta en ningún paso (cancelar siempre el modal).
    - expect: Criterio de éxito: cada valor se rechaza con un mensaje de validación y el modal no se abre.
    - expect: Criterio de fallo: el modal 'Confirmar Transacción' se abre (comportamiento observado actual).
  2. Escribir Cedula = '-1234567', pulsar `Finalizar Transaccion`.
    - expect: Esperado: mensaje de error y modal cerrado. OBSERVADO: no hay error y se abre el modal 'Confirmar Transacción'. Pulsar `Cancelar`.
  3. Escribir Cedula = '1234567.5' y pulsar `Finalizar Transaccion`.
    - expect: Esperado: mensaje de error. OBSERVADO: se abre el modal. Pulsar `Cancelar`.
  4. Escribir Cedula = '1e9' y pulsar `Finalizar Transaccion`.
    - expect: Esperado: mensaje de error. OBSERVADO: se abre el modal. Pulsar `Cancelar`.
    - expect: `api.getStock('E2E Validaciones')` sigue igual al valor inicial.

### 3. 3. Carrito, cantidades y confirmación (E2E Validaciones - no muta stock)

**Seed:** `tests/seed.spec.ts`

#### 3.1. 3.1 Control de cantidad: tope en el stock, mínimo 1, campo de solo lectura y re-agregado

**File:** `tests/venta/carrito-cantidad.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-03 (la UI limita '+' al stock), RN-05. Videojuego `E2E Validaciones` (stock 10, precio 180000); no consume stock. En `/home` la cantidad de la tarjeta inicia en 1.
    - expect: Criterio de éxito: la cantidad nunca baja de 1 ni sube de 10. Fallo: se permite una cantidad > stock o < 1.
  2. Comprobar el estado inicial de los controles de la tarjeta.
    - expect: El botón `-` está deshabilitado y el `spinbutton` vale 1.
    - expect: El `spinbutton` es `readOnly` (`evaluate(e => e.readOnly)` = true): no usar `fill()` sobre él.
  3. Pulsar `+` 12 veces.
    - expect: El `spinbutton` queda en 10 (= stock leído de `data-stock`).
    - expect: COMPORTAMIENTO OBSERVADO (H9): el botón `+` NO se deshabilita al llegar al tope; simplemente deja de incrementar.
  4. Pulsar `-` 12 veces (solo mientras esté habilitado).
    - expect: El `spinbutton` queda en 1 y `-` vuelve a estar deshabilitado.
  5. Pulsar `+` dos veces (cantidad 3) y `Agregar E2E Validaciones al carrito`; ir a `Carrito`.
    - expect: Resumen: Videojuegos = 1, Total = `$540000` (3 x 180000).
    - expect: COMPORTAMIENTO OBSERVADO (H3): la línea del carrito muestra `$180000` (precio unitario) sin la cantidad.
  6. Volver a `/home` (navegación por el enlace `Inicio`), pulsar `+` una vez más (cantidad 2 en la tarjeta, que se reinicia) y `Agregar E2E Validaciones al carrito` otra vez; volver a `Carrito`.
    - expect: COMPORTAMIENTO OBSERVADO (H2): el carrito sigue con una sola línea y el Total sigue en `$540000`; la cantidad no se actualiza ni se muestra aviso. Documentar como posible mejora/bug.
    - expect: El stock de `E2E Validaciones` por API no cambia.

#### 3.2. 3.2 Quitar un juego del carrito lo deja vacío y deshabilita el envío

**File:** `tests/venta/carrito-eliminar.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-05, RN-06 (sin venta). Videojuego `E2E Validaciones`; no consume stock. Agregar el juego (cantidad 1) y abrir `/cart`.
    - expect: Criterio de éxito: el carrito vacío no permite finalizar. Fallo: `Finalizar Transaccion` sigue habilitado con carrito vacío.
  2. Recargar la página (`page.reload()`).
    - expect: El carrito conserva `E2E Validaciones` (persistido en `localStorage`) y el botón `Eliminar E2E Validaciones del carrito` sigue presente.
  3. Pulsar `Eliminar E2E Validaciones del carrito`.
    - expect: Desaparece la tarjeta del juego y se ve 'El carrito esta vacio' y 'Agrega videojuegos desde la pagina de Inicio'.
    - expect: Resumen: Videojuegos = 0, Total = `$0`.
    - expect: `Finalizar Transaccion` está deshabilitado.
    - expect: `localStorage.cart_games` y `cart_transJuegos` valen `[]`.
  4. Volver a `/home` y comprobar el stock.
    - expect: `data-stock` de la tarjeta `E2E Validaciones` y `api.getStock` no cambian.

#### 3.3. 3.3 Carrito vacío: el botón Finalizar Transaccion está deshabilitado

**File:** `tests/venta/carrito-eliminar.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-04. Contexto nuevo, sin juegos en el carrito, sin tocar ningún videojuego (no consume stock). Ir directamente a `/cart`.
    - expect: Criterio de éxito: se muestra el estado vacío y no se puede enviar. Fallo: el botón está habilitado.
  2. Observar el carrito vacío y el resumen.
    - expect: Se ve 'El carrito esta vacio' y 'Agrega videojuegos desde la pagina de Inicio'.
    - expect: Total = `$0`, Videojuegos = 0, Tipo = venta.
    - expect: `Finalizar Transaccion` está deshabilitado (`toBeDisabled()`), incluso con el formulario completo y válido.

#### 3.4. 3.4 Cancelar el modal de confirmación no vende ni vacía el carrito

**File:** `tests/venta/carrito-cancelar.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-01 (el stock no se toca sin confirmar). Videojuego `E2E Validaciones`; no consume stock. `const cliente = clienteUnico()`; `inicial = await api.getStock('E2E Validaciones')`. Agregar el juego (cantidad 2) y abrir `/cart`; llenar el formulario con datos válidos.
    - expect: Criterio de éxito: tras cancelar nada cambia. Fallo: aparece una transacción o cambia el stock.
  2. Pulsar `Finalizar Transaccion`.
    - expect: Se abre el modal 'Confirmar Transacción' con `cantidad: 2 x 180000` y TOTAL 360000.
  3. Pulsar `Cancelar`.
    - expect: El botón `Confirmar transaccion` queda oculto (modal cerrado).
    - expect: El carrito aún contiene `E2E Validaciones` y el Total es `$360000`.
    - expect: Los campos del formulario conservan los datos escritos.
    - expect: No se muestra la notificación de éxito (opacidad 0).
    - expect: `api.getStock('E2E Validaciones')` sigue siendo `inicial`.
  4. Abrir `/history` (pestaña Ventas) y buscar la cédula del cliente.
    - expect: No existe ninguna fila con esa cédula.

#### 3.5. 3.5 El tipo Alquiler recalcula el total y vuelve a Venta sin alterar el carrito

**File:** `tests/venta/carrito-tipo.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-05. Videojuego `E2E Validaciones` (venta 180000, alquiler 45000); no consume stock y NO completa ningún alquiler (el flujo de alquiler real usa `E2E Alquiler` y está fuera de alcance). Agregar el juego con cantidad 3 y abrir `/cart`.
    - expect: Criterio de éxito: el total depende del tipo seleccionado. Fallo: el total no cambia al alternar.
  2. Verificar el tipo por defecto.
    - expect: El radio `Venta` está marcado; Tipo = venta; Total = `$540000`.
  3. Seleccionar el radio `Alquiler`.
    - expect: Tipo = alquiler; Total = `$135000` (3 x 45000); la línea del carrito muestra `$45000`.
    - expect: Aparece el campo `Fecha de devolución`.
  4. Volver a seleccionar el radio `Venta`.
    - expect: Tipo = venta; Total = `$540000`; el campo `Fecha de devolución` desaparece.
  5. Verificar el stock.
    - expect: `api.getStock('E2E Validaciones')` no cambia.

#### 3.6. 3.6 Alquiler sin fecha de devolución no abre el modal (comportamiento observado)

**File:** `tests/venta/carrito-tipo.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-03/RN-05 (borde del selector de tipo). Videojuego `E2E Validaciones`; no consume stock. Agregar el juego, abrir `/cart`, seleccionar `Alquiler` y llenar el formulario con datos válidos (`clienteUnico()`), sin fecha de devolución.
    - expect: Criterio de éxito: no se crea ninguna transacción. Fallo: se abre el modal o cambia el stock.
  2. Pulsar `Finalizar Transaccion`.
    - expect: COMPORTAMIENTO OBSERVADO (H8): no pasa nada visible: el modal 'Confirmar Transacción' no se abre y no hay mensaje que pida la fecha.
    - expect: `api.getStock('E2E Validaciones')` no cambia.

#### 3.7. 3.7 El backend rechaza una cédula de 11 dígitos y la UI conserva el carrito (POSIBLE BUG)

**File:** `tests/venta/carrito-error-backend.spec.ts`

**Steps:**
  1. Referencias y estado inicial: VAL-01 y manejo de errores (H5). Videojuego `E2E Validaciones` (el envío es rechazado, no descuenta stock). `inicial = await api.getStock('E2E Validaciones')`. Agregar el juego (cantidad 3) y abrir `/cart`.
    - expect: Criterio de éxito: la UI informa del error, el stock no cambia y el carrito se conserva. Fallo: la venta se registra o se pierde el carrito.
    - expect: Si en el futuro el formulario rechaza la cédula larga con un mensaje de validación, actualizar el escenario (ese sería el comportamiento correcto).
  2. Llenar Cedula = '12345678901' (11 dígitos), Nombre = 'Prueba', Apellidos = 'Overflow', Direccion = 'Calle 1', Telefono = '3001234567' y pulsar `Finalizar Transaccion`.
    - expect: COMPORTAMIENTO OBSERVADO (H5): el formulario NO muestra error y se abre el modal 'Confirmar Transacción' con cantidad: 3 x 180000, TOTAL 540000.
  3. Pulsar `Confirmar transaccion`.
    - expect: El backend responde 500 a `POST /api/transacciones` (puede capturarse con `page.waitForResponse`).
    - expect: Se muestra la notificación 'Error en la transacción' con el texto 'No se pudo procesar la transacción. Por favor verifica los datos e intenta nuevamente.' (opacidad 1).
    - expect: El modal de confirmación se cierra.
  4. Verificar el estado tras el error.
    - expect: `api.getStock('E2E Validaciones')` sigue siendo `inicial`.
    - expect: El carrito aún contiene `E2E Validaciones` (Total `$540000`) y el formulario conserva los datos.

#### 3.8. 3.8 La notificación de éxito no está visible antes de vender (guardia contra falso positivo)

**File:** `tests/venta/carrito-notificacion.spec.ts`

**Steps:**
  1. Referencias y estado inicial: H1. Contexto nuevo en `/cart`, sin interacción previa; no usa ni consume ningún videojuego.
    - expect: Criterio de éxito: el título existe en el DOM pero con opacidad 0. Fallo: la notificación aparece sin haber vendido.
  2. Localizar `getByRole('heading', { name: '¡Transacción exitosa!' })` sin haber realizado ninguna venta.
    - expect: El elemento existe en el DOM (`toHaveCount(1)`), pero su contenedor tiene opacidad 0 (`toHaveCSS('opacity', '0')`): comprobar que `toBeVisible()` por sí solo NO es una aserción fiable en este caso.

### 4. 4. Juego agotado (E2E Agotado - no muta stock)

**Seed:** `tests/seed.spec.ts`

#### 4.1. 4.1 Un videojuego sin stock no se puede agregar al carrito

**File:** `tests/venta/agotado.spec.ts`

**Steps:**
  1. Referencias y estado inicial: RN-03. Videojuego `E2E Agotado` (stock 0, precio 120000); no consume stock. Ir a `/home` (seed) con carrito vacío.
    - expect: Criterio de éxito: el botón de agregar está deshabilitado. Fallo: el botón está habilitado.
  2. Localizar la tarjeta con `getByTestId('game-card').filter({ has: page.getByRole('heading', { name: 'E2E Agotado' }) })`.
    - expect: El atributo `data-stock` de la tarjeta es `Stock: 0`; `api.getStock('E2E Agotado')` es 0.
  3. Localizar `getByRole('button', { name: 'Agregar E2E Agotado al carrito' })`.
    - expect: El botón está deshabilitado (`toBeDisabled()`).
    - expect: En contraste, el botón `Agregar E2E Validaciones al carrito` de otra tarjeta está habilitado.
  4. Ir a `Carrito` (enlace `Carrito`, `/cart`).
    - expect: Se ve 'El carrito esta vacio' y `Finalizar Transaccion` está deshabilitado: nada del juego agotado llegó al carrito.

Nota: el caso "pulsar `+` con stock 0 / click forzado" (antes 4.2) se fusionó aquí por ser redundante; el comportamiento del `+` (H9) queda cubierto en 3.1.
