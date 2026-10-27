import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { API_URL, FRONTEND_URL } from './fixtures/env';

const isWindows = process.platform === 'win32';
const backendDir = path.resolve(__dirname, '../backend/GameHub');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Cada worker abre un Chromium (~250 MB) además del backend, Vite y MySQL: con pocos GB libres el cierre del
  // contexto (que guarda la traza) se vuelve lento y supera el timeout, sobre todo en --ui.
  workers: 2,
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: FRONTEND_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Sin video: codificarlo por cada prueba es lo más pesado al cerrar el contexto y la traza ya muestra los pasos.
    video: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      // Backend con perfil e2e: BD gamehub_e2e recreada en cada arranque + e2e-seed.sql
      command: isWindows ? `"${path.join(backendDir, 'mvnw.cmd')}" spring-boot:run` : './mvnw spring-boot:run',
      cwd: backendDir,
      url: `${API_URL}/v3/api-docs`,
      env: {
        SPRING_PROFILES_ACTIVE: 'e2e',
        SERVER_PORT: new URL(API_URL).port,
        E2E_FRONTEND_URL: FRONTEND_URL,
      },
      timeout: 240_000,
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: `npm run dev -- --port ${new URL(FRONTEND_URL).port} --strictPort`,
      cwd: path.resolve(__dirname, '../frontend/gamehub'),
      url: FRONTEND_URL,
      env: { VITE_API_URL: API_URL },
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
