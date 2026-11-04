# GameHub E2E — Playwright + Playwright Test Agents + Claude Code

## Requisitos previos (una sola vez)

1. JDK 21 y las dependencias del frontend instaladas (`cd frontend/gamehub && npm install`).
2. Base de datos de pruebas en MySQL (como root):
   ```sql
   CREATE DATABASE gamehub_e2e CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   GRANT ALL PRIVILEGES ON gamehub_e2e.* TO 'gamehub'@'localhost';
   FLUSH PRIVILEGES;
   ```
   Las credenciales se toman de `backend/GameHub/.env` (`MYSQL_USER`, `MYSQL_PASSWORD`, `JWT_SECRET`).
3. `cd e2e && npm install && npx playwright install chromium`

## Ejecutar

```bash
npm test                              # levanta backend (perfil e2e, :8090) y frontend (:5174) y corre todo
npm run test:ui                       # modo interactivo
npx playwright test tests/login.spec.ts
npx playwright test -g "credenciales inválidas"
npm run report                        # reporte HTML con trazas de los fallos
```

El entorno E2E está separado del de desarrollo:

| | Desarrollo | E2E |
|---|---|---|
| Backend | :8080, perfil `dev`, BD `gamehub` | :8090, perfil `e2e`, BD `gamehub_e2e` |
| Frontend | :5173 | :5174 |
| Datos | `import.sql` | `import.sql` + `e2e-seed.sql` (se recrean en cada arranque del backend) |

Si los servidores ya están corriendo en :8090/:5174, Playwright los reutiliza. Para empezar con datos limpios, detén el backend E2E y vuelve a ejecutar.

## Piezas clave

- `fixtures/gamehub.ts`: `test`/`expect` del proyecto. **Importa siempre desde aquí.**
  - **Sesión:** login por API una vez por worker. El JWT se inyecta en `localStorage["token"]`, así que cada página arranca autenticada. Para empezar sin sesión: `test.use({ storageState: { cookies: [], origins: [] } })`.
  - `api`: lee el estado del backend y **prepara precondiciones sin pasar por la UI**. Lectura: `getVideojuego`, `getStock`, `getTransaccionesDeCliente`, `getTransaccionesPorTipo`, `getAlquileresPorEstado`, `getDevoluciones`, `getTotalDevoluciones`. Escritura: `crearTransaccion`, `crearAlquiler`, `registrarDevolucion`.
  - `clienteUnico()`: datos de cliente con una cédula única por ejecución. `fechaFutura(dias)`: fecha ISO para `fechaDev` (el backend la valida con `@Future`).
- `tests/seed.spec.ts`: el punto de partida de los agentes (catálogo autenticado).
- `specs/`: requisitos y planes en Markdown. Un par `requisitos-<flujo>.md` (matriz de requisitos y criterios de aceptación, escrito a mano) + `<flujo>.md` (el plan que genera el planner) por cada flujo: `venta`, `alquiler` y `devoluciones`.

## Suites

| Suite | Videojuego propio | Pruebas | Consumo de stock por corrida |
|---|---|---|---|
| `tests/login.spec.ts` | — | 3 | — |
| `tests/venta/` | `E2E Venta`, `E2E Validaciones`, `E2E Agotado` | 19 | 5 de 100 |
| `tests/alquiler/` | `E2E Alquiler` | 9 | 5 de 100 |
| `tests/devoluciones/` | `E2E Devolucion` | 10 | 12 de 100 |

Cada suite usa **su propio videojuego**: las pruebas corren en paralelo y no deben competir por el stock. Las que descuentan stock van en un `describe` con `mode: 'serial'`. Las devoluciones restituyen el stock (RN-02), pero las ventas y los alquileres lo consumen, así que conviene reiniciar el backend E2E cada pocas corridas.

## Integración continua

`.github/workflows/e2e.yml` corre toda la suite en GitHub Actions en cada push a `main` y en cada PR hacia `main` (≈3 min). Usa un MySQL 8 como servicio, con credenciales y `JWT_SECRET` desechables definidos en el propio workflow, e instala Chromium. El reporte HTML se sube siempre como artefacto `playwright-report`; las trazas y capturas, como `test-results` solo si algo falla. Localmente nada cambia: `npm test` sigue igual.

## Flujo con los agentes

Abre Claude Code **desde la carpeta `e2e/`**, para que cargue `.claude/agents/` y el servidor MCP de `.mcp.json`. La primera vez, aprueba el servidor `playwright-test`.

1. **Planner:**
   > Usa el agente playwright-test-planner para crear un plan de pruebas del flujo de venta a partir de `specs/requisitos-venta.md`. Seed: `tests/seed.spec.ts`. Guarda el plan en `specs/venta.md`.

   Revisa `specs/venta.md` antes de seguir.
2. **Generator:**
   > Usa el agente playwright-test-generator para generar las pruebas de `specs/venta.md` en `tests/venta/`.

   Después, revisa que las pruebas importen de `../../fixtures/gamehub`, usen el fixture `api` para las aserciones relativas de stock y `clienteUnico()` para el cliente.
3. **Healer:**
   > Usa el agente playwright-test-healer para arreglar las pruebas que fallan.

   Si la causa es un bug de la app y no un cambio de UI, la prueba debe conservar su aserción y marcarse con `test.fixme`, con una referencia al bug.

## Cuidado con los falsos positivos

`toBeVisible()` considera visible un elemento con `opacity: 0`. Las alertas animadas por opacidad (como la de credenciales inválidas) se verifican con `role="alert"` + `aria-hidden`, como en `LoginForm.jsx`.
