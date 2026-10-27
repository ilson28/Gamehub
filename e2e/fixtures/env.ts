// Puertos distintos a los de desarrollo (8080/5173) para no reutilizar por error la app conectada a la BD de dev.
export const FRONTEND_URL = process.env.E2E_FRONTEND_URL ?? 'http://localhost:5174';
export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8090';

// Usuario sembrado por backend/GameHub/src/main/resources/import.sql
export const ADMIN = {
    username: process.env.E2E_USER ?? 'adminGamehub',
  password: process.env.E2E_PASSWORD ?? 'admin123',
};
