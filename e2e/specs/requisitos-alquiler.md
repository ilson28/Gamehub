# Requisitos y criterios de aceptación — Flujo de alquiler

Insumo para el agente **planner**. Misma estructura que `requisitos-venta.md`.
Fuentes: `README.md` (reglas de negocio), código (`TransaccionServiceImpl.save`, `Transaccion.calcularTotal`, `Cart.jsx`, `History.jsx`) y la app corriendo.

El flujo de **venta** ya está automatizado en `tests/venta/` (23 pruebas). Este plan cubre lo que diferencia al alquiler; no repitas escenarios ya cubiertos allí.

## 1. Matriz de requisitos

| ID | Requisito | Fuente | Estado en el código |
|---|---|---|---|
| RN-01 | Al alquilar, el stock del videojuego disminuye en la cantidad alquilada | `TransaccionServiceImpl.save` | ✅ Se descuenta igual que en una venta (no hay reserva) |
| RN-04 | Toda transacción queda asociada a un cliente (se crea si la cédula no existe) | `TransaccionServiceImpl.save` | ✅ Implementado |
| RN-05 | Total de alquiler = Σ (cantidad × **precio de alquiler**) | `Transaccion.calcularTotal` · `CartContext.calculateTotal` | ✅ `tipo != "venta"` usa `precioAlquiler` |
| RN-06 | El alquiler queda registrado en el historial, pestaña Alquileres | `History.jsx` | ✅ Implementado |
| RN-07 | Un alquiler nace con estado `alquilado` | `Transaccion.calcularTotal` | ✅ `tipo != "venta"` ⇒ `estado = "alquilado"` |
| RN-08 | Un alquiler guarda su fecha de devolución | `TransaccionRequestDto.fechaDev` | ⚠️ El backend solo la valida con `@Future`; el `input type="date"` del carrito **no tiene `min`** |
| VAL-04 | Un alquiler sin fecha de devolución no se puede enviar | `Cart.jsx:47` | ⚠️ `return` en silencio: no abre el modal y **no muestra ningún mensaje**. Ya cubierto por la prueba 3.6 de venta |

## 2. Datos de prueba (`backend/GameHub/src/main/resources/e2e-seed.sql`)

| Videojuego | Stock inicial | Precio venta | Precio alquiler | Uso |
|---|---|---|---|---|
| `E2E Alquiler` | 100 | 150000 | **40000** | **Único juego de este plan**; alquileres reales que descuentan stock |
| `E2E Venta` | 100 | 200000 | 50000 | Del plan de venta: **NO USAR** |
| `E2E Validaciones` | 10 | 180000 | 45000 | Del plan de venta: **NO USAR** |
| `E2E Devolucion` | 100 | 160000 | 40000 | Reservado al flujo de devoluciones: **NO USAR** |
| `E2E Agotado` | 0 | 120000 | 35000 | Del plan de venta: **NO USAR** |

Reglas:
- Todos los escenarios de este plan usan **`E2E Alquiler`**. Los que completan un alquiler mutan su stock: agrúpalos en un mismo `describe` en modo serial, como hace `tests/venta/venta-exitosa.spec.ts`.
- Aserciones de stock **relativas**: `const inicial = await api.getStock('E2E Alquiler')` y luego `expect.poll(...).toBe(inicial - cant)`.
- Cliente con `clienteUnico()`. Fecha de devolución con `fechaFutura()` (ambos en `fixtures/gamehub.ts`).
- La sesión ya viene iniciada; no inicies sesión por la UI.

## 3. Criterios de aceptación

```gherkin
Escenario: Alquiler exitoso descuenta stock y queda en el historial   # RN-01, RN-04, RN-05, RN-06, RN-07, RN-08
  Dado que el videojuego "E2E Alquiler" tiene stock S
  Cuando agrego "E2E Alquiler" al carrito con cantidad 2
  Y en el Carrito elijo "Alquiler" y una fecha de devolución futura
  Y lleno los datos de un cliente nuevo
  Y presiono "Finalizar Transaccion" y luego "Confirmar transaccion"
  Entonces veo el mensaje "¡Transacción exitosa!"
  Y el total mostrado antes de confirmar era 2 × 40000
  Y el stock de "E2E Alquiler" es S − 2
  Y en Historial (pestaña Alquileres) aparece un alquiler con estado "alquilado"
  Y su detalle muestra la fecha de devolución elegida

Escenario: El tipo de transacción determina el precio                 # RN-05
  Dado que agregué "E2E Alquiler" al carrito con cantidad 3
  Cuando selecciono "Alquiler"
  Entonces el Total es 3 × 40000 y aparece el campo "Fecha de devolución"
  Cuando vuelvo a seleccionar "Venta"
  Entonces el Total es 3 × 150000 y el campo "Fecha de devolución" desaparece

Escenario: Una fecha de devolución pasada es rechazada por el backend  # RN-08 (POSIBLE BUG)
  Dado que agregué "E2E Alquiler" al carrito y elegí "Alquiler"
  Cuando escribo una fecha de devolución anterior a hoy
  Y confirmo la transacción
  Entonces el backend responde 400
  Y la UI muestra "Error en la transacción"
  Y el stock de "E2E Alquiler" no cambia
```

## 4. Selectores disponibles (accesibles, verificados)

- Tarjeta: `getByTestId('game-card')` filtrada por `getByRole('heading', { name: 'E2E Alquiler' })`; stock en `data-stock` (`"Stock: N"`); botones `+` / `-` y `getByRole('spinbutton')` (**readOnly**: no uses `fill`).
- Botón por juego: `Agregar E2E Alquiler al carrito`.
- Carrito: radios `getByRole('radio', { name: 'Venta' | 'Alquiler' })`; `getByLabel('Fecha de devolución')` (solo visible con Alquiler); formulario `getByLabel('Cedula' | 'Nombre' | 'Apellidos' | 'Direccion' | 'Telefono')`; botón `Finalizar Transaccion`.
- Modal: título "Confirmar Transacción"; botones `Cancelar` y `Confirmar transaccion` (sin tilde, "t" minúscula).
- Historial (`/history`): pestañas `getByRole('tab', { name: 'Ventas' | 'Alquileres' })` con `aria-selected`; filtro de estado `getByLabel('Filtrar alquileres por estado')` con las opciones "Todos los alquileres" / "Alquileres Activos" / "Alquileres devueltos"; filtro `getByLabel('Filtrar por fecha')`; filas `getByRole('row').filter({ hasText: <cedula> })`; icono `getByRole('img', { name: 'Ver detalles' })`. En la pestaña Alquileres hay columnas extra **Fecha Devolución** y **Estado**.
- Fixtures (`fixtures/gamehub.ts`): `api.getStock`, `api.getTransaccionesPorTipo('alquiler')`, `api.getAlquileresPorEstado('alquilado'|'devuelto')`, `api.crearAlquiler(titulo, cliente, cant, fechaDev)`, `clienteUnico()`, `fechaFutura(dias)`.

## 5. Trampas conocidas (mismas que en venta)

- La notificación "¡Transacción exitosa!" / "Error en la transacción" está **siempre en el DOM** con `opacity-0` y sin `role="alert"`: verifícala con `toHaveCSS('opacity', '1')`, nunca solo con `toBeVisible()`. Se oculta sola a los 5 s y mientras es visible "Finalizar Transaccion" queda deshabilitado.
- El modal cerrado se comprueba con `toBeHidden()` sobre `Confirmar transaccion`, no con `count()`.
- `typeOfTransaction` **no se persiste** en localStorage (sí `cart_games` y `cart_transJuegos`): recargar `/cart` devuelve el tipo a "venta".
