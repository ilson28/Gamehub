# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

GameHub is a video game store manager (inventory, sales, rentals, returns, transaction history). Two independent apps in one repo:

- `backend/GameHub/` — Spring Boot 3.4 / Java 21 REST API, MySQL, JWT auth, Cloudinary image storage. Deployed to Render via the Dockerfile.
- `frontend/gamehub/` — React 19 + Vite + Tailwind CSS v4 SPA. Deployed to Vercel (`vercel.json` rewrites all routes to `index.html`).

The domain language is Spanish (`VideoJuego`, `Transaccion`, `Cliente`, `RegistroDevolucion`, `tipo`, `estado`, …); keep new names consistent with it.

## Commands

### Backend (run from `backend/GameHub/`)

```bash
./mvnw spring-boot:run                          # run (needs env vars, see below)
./mvnw clean install -DskipTests                # build jar (what the Dockerfile does)
./mvnw test                                     # run tests
./mvnw test -Dtest=GameHubApplicationTests      # single test class
./mvnw test -Dtest=ClassName#methodName         # single test method
docker compose up --build                       # MySQL 8 + backend, profile dev
```

The only test is a `@SpringBootTest` context-load test, so it needs a reachable MySQL and the env vars below.

### Frontend (run from `frontend/gamehub/`)

```bash
npm install
npm run dev       # Vite dev server on :5173
npm run build
npm run lint      # ESLint (flat config); there is no test runner
```

## Configuration

- Backend env vars (loaded from a `.env` via spring-dotenv, or from docker-compose): `MYSQL_DB`, `MYSQL_USER`, `MYSQL_PASSWORD`, `JWT_SECRET`, `CLOUD_NAME`, `API_KEY`, `API_SECRET`; prod also uses `MYSQL_URL`.
- Profiles: `application-dev.properties` (datasource host/port come from `MYSQL_HOST`/`MYSQL_PORT`, defaulting to `mysql:3306`, the docker-compose service; set `MYSQL_HOST=localhost` in `.env` to run against a local MySQL with `./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`; `ddl-auto=create-drop`, so the schema is rebuilt and `import.sql` seeds the `adminGamehub` ADMIN user on each start) and `application-prod.properties` (`ddl-auto=validate`, Aiven MySQL). The README calls the prod profile `pro`, but the file is `prod`. No profile is active by default — set `SPRING_PROFILES_ACTIVE`.
- docker-compose exposes MySQL on host port 3307.
- Frontend needs `VITE_API_URL` (e.g. `http://localhost:8080`) in `frontend/gamehub/.env`.
- Allowed CORS origins come from `app.cors.allowed-origins` (default in `config/app/AppConfig.java`: `localhost:5173` and the Vercel URL).

## E2E tests (`e2e/`)

Playwright project with Playwright Test Agents (planner/generator/healer in `e2e/.claude/agents/`, MCP server in `e2e/.mcp.json`); see `e2e/README.md`.

```bash
cd e2e
npm test                                   # starts backend (profile e2e, :8090) + frontend (:5174) via webServer
npx playwright test tests/login.spec.ts    # single file
npx playwright test -g "<test title>"      # single test
```

- Profile `e2e` (`application-e2e.properties`) uses DB `gamehub_e2e`, `create-drop`, and loads `import.sql` + `e2e-seed.sql`. Seeded games have no image, so no Cloudinary is needed. Each test owns its own seeded game, because tests run in parallel and would otherwise race on stock.
- Tests import `test`/`expect` from `e2e/fixtures/gamehub.ts`: it logs in via API once per worker and injects the JWT into `localStorage["token"]`, and it provides an `api` fixture for state checks. Stock assertions are relative (read the stock first, then compare).
- Stable selectors: `data-testid="game-card"` (stock in its `data-stock` attribute), plus aria-labels `Agregar|Editar <titulo>` and `Eliminar <titulo> del carrito` in `Game.jsx`.

## Backend architecture

Package root `com.gameHub.app`, layered:

- `presentation/controller` → `service/interfaces` + `service/implementation` → `persistence/repository` (Spring Data JPA, custom JPQL in `@Query`) → `persistence/entity`.
- `presentation/dto` holds request/response DTOs. Controllers wrap results in `presentation.dto.ApiResponse<T>` (`message`, `success`, `timestamp`, `data`). There is also an unrelated, legacy `service.exception.ApiResponse`; don't confuse the two.
- `presentation/advice/GlobalExceptionHandler` maps exceptions to `ApiResponse` errors. Services throw `ResourceNotFoundException` for 404s.
- Mapping is mixed: `VideoJuegoMapper` is a Spring-injected MapStruct mapper; `TransaccionMapper`/`ClienteMapper` are MapStruct used through static `INSTANCE`; `RegistroDevolucionServiceImpl` and `ClienteServiceImpl` use `ModelMapper` instantiated inline. Lombok + MapStruct annotation processors are wired in `pom.xml` (including `lombok-mapstruct-binding`).
- **Security**: stateless JWT. `JwtFilter` reads `Authorization: Bearer …`, `AppConfig` provides the `UserDetailsService` backed by `Usuario`/`UsuarioRepository`. Everything is authenticated except `/api/auth/**`, `/api/images/**` and Swagger paths (`SecurityConfig.publicEndpoints()`).
- **Soft deletes**: `VideoJuego` and `Transaccion` have an `activo` int flag (1/0). Deletes set `activo = 0`, and queries filter on `activo = 1`.
- **Images**: game create/update are `multipart/form-data` with a JSON part `videoJuegoDto` and a file part `imagen`. `ImagenServiceImpl` uploads to Cloudinary and stores an `Imagen` entity (URL + public id) linked to the game. On update the old Cloudinary image is deleted first. `FileImageController`/`ImagesUtil` is the older local-file approach.
- **Transactions**: `TransaccionServiceImpl.save` finds or creates the `Cliente` by `cedula`, decrements stock per `Trans_juego` line (rejects if it would go negative), then saves. `Transaccion.@PrePersist` sets date/time, `activo`, `estado` (`vendido` for `tipo = "venta"`, else `alquilado`) and computes line and total prices from `precioVenta`/`precioAlquiler`.
- **Returns**: saving a `RegistroDevolucion` sets the transaction's `estado` to `devuelto`. It also restores stock for each line via `VideoJuegoRepository.addStock`. It does not check that the transaction is a rental or that it was not already returned.

`backend/GameHub/bin/` is a stale compiled copy (IDE output) that is gitignored but still tracked. Ignore it and edit only `src/`.

## Frontend architecture

- `src/services/api.js` is the shared axios instance (`baseURL = VITE_API_URL`). `axiosInterceptor.js` (imported for side effects in `App.jsx`) attaches the JWT from `localStorage.token` and, on 401 outside `/login`, clears the token and redirects to `/welcome`. One service module per backend resource (`videojuegoService.js`, `transaccionService.js`, …) returns `response.data`, which is the backend `ApiResponse` envelope.
- Data fetching: TanStack Query (`QueryClientProvider` in `main.jsx`) for queries and mutations in pages, alongside a simpler `useApiRequest` hook (loading/error wrapper).
- Global state via contexts in `src/contexts/` (Auth → token, Cart, Modal), composed in `providers/GlobalProviders.jsx` and read through `src/hooks/use*Context.js`.
- Routing in `AppRouter.jsx`: private routes sit behind `guards/PrivateGuard` (checks the token) inside `LayoutWithHeader`; `/welcome` and `/login` are public.
- Forms use react-hook-form + zod; the schemas live in `src/models/form-*.model.js`.
