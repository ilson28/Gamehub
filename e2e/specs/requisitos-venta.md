# Requisitos y criterios de aceptación — Flujo de venta

Insumo para el agente **planner** (etapas 1 y 2 del flujo de automatización).
Fuentes: `README.md` (reglas de negocio), código (validaciones reales) y la app corriendo.

## 1. Matriz de requisitos

| ID | Requisito | Fuente | Estado en el código |
|---|---|---|---|
| RN-01 | Al vender, el stock del videojuego disminuye en la cantidad vendida | README · `TransaccionServiceImpl.save` | ✅ Implementado |
| RN-03 | No se permiten transacciones sin stock suficiente | README · `TransaccionServiceImpl.save`, `Game.jsx` | ✅ Backend rechaza; la UI deshabilita "agregar" con stock 0 y limita "+" al stock |
| RN-04 | Toda transacción queda asociada a un cliente (se crea si la cédula no existe) | README · `TransaccionServiceImpl.save` | ✅ Implementado |
| RN-05 | Total de venta = Σ (cantidad × precio de venta) | `Transaccion.calcularTotal` · `CartContext.calculateTotal` | ✅ Implementado |
| RN-06 | La venta queda registrada en el historial de transacciones | README · `History.jsx` | ✅ Implementado |
| VAL-01 | Cédula obligatoria, mínimo 7 dígitos | `form-client.model.js` | ✅ "Debe tener minimo 7 digitos" |
| VAL-02 | Teléfono obligatorio, exactamente 10 dígitos | `form-client.model.js` | ✅ "Debe tener 10 digitos" |
| VAL-03 | Nombre, apellido y dirección obligatorios | `form-client.model.js` | ✅ |
| RN-02 | Al devolver un alquiler el stock se restablece | README | ⚠️ **No implementado**: `RegistroDevolucionServiceImpl.save` solo cambia el estado a `devuelto`. Fuera de alcance de este flujo; candidato a prueba `test.fixme` + bug |

## 2. Datos de prueba disponibles (`backend/GameHub/src/main/resources/e2e-seed.sql`)

| Videojuego | Stock inicial | Precio venta | Uso |
|---|---|---|---|
| `E2E Venta` | 100 | 200000 | Camino feliz de la venta |
| `E2E Validaciones` | 10 | 180000 | Validaciones del formulario de cliente |
| `E2E Alquiler` | 10 | 150000 | Reservado para el flujo de alquiler/devolución |
| `E2E Agotado` | 0 | 120000 | Regla RN-03 (sin stock) |

Reglas para las pruebas:
- Cada escenario usa **su propio videojuego**: las pruebas corren en paralelo y no deben competir por el stock.
- Las aserciones de stock son **relativas**: leer el stock con el fixture `api` al inicio y comparar contra `inicial − cantidad`.
- Cliente con **cédula única** por ejecución: `clienteUnico()` en `fixtures/gamehub.ts`.
- La sesión ya viene iniciada (fixture `storageState`); no iniciar sesión por la UI en estos escenarios.

## 3. Criterios de aceptación

```gherkin
Escenario: Venta exitosa descuenta el stock y queda en el historial   # RN-01, RN-04, RN-05, RN-06
  Dado que el videojuego "E2E Venta" tiene stock S
  Cuando en Inicio selecciono cantidad 2 y agrego "E2E Venta" al carrito
  Y en el Carrito elijo "Venta" y lleno los datos de un cliente nuevo
  Y presiono "Finalizar Transaccion" y luego "Confirmar transaccion"
  Entonces veo el mensaje "¡Transacción exitosa!"
  Y el carrito queda vacío
  Y el total mostrado antes de confirmar era 2 × 200000
  Y el stock de "E2E Venta" es S − 2
  Y en Historial (pestaña Ventas) aparece una venta con la cédula del cliente

Escenario: Datos de cliente inválidos bloquean la venta              # VAL-01, VAL-02
  Dado que agregué "E2E Validaciones" al carrito
  Cuando ingreso la cédula "123" y el teléfono "300"
  Y presiono "Finalizar Transaccion"
  Entonces veo "Debe tener minimo 7 digitos" y "Debe tener 10 digitos"
  Y no se abre el modal "Confirmar Transacción"
  Y el stock de "E2E Validaciones" no cambia

Escenario: Un videojuego sin stock no se puede agregar al carrito    # RN-03
  Dado que "E2E Agotado" tiene stock 0
  Entonces el botón "Agregar E2E Agotado al carrito" está deshabilitado
```

## 4. Selectores disponibles (accesibles)

- Tarjeta de juego: `getByTestId('game-card')` filtrada por `getByRole('heading', { name: <titulo> })`; el stock está en su atributo `data-stock` (`"Stock: N"`).
- Botones por juego: `Agregar <titulo> al carrito`, `Editar <titulo>`, `Eliminar <titulo> del carrito`.
- Formulario de cliente: `getByLabel('Cedula' | 'Nombre' | 'Apellidos' | 'Direccion' | 'Telefono')`.
- Tipo de transacción: radios `Venta` / `Alquiler`.
