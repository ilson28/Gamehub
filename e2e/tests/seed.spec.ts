// Punto de partida de los Playwright Test Agents: página autenticada en el catálogo con los datos de e2e-seed.sql.
import { test, expect } from '../fixtures/gamehub';

test.describe('GameHub', () => {
  test('seed', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'E2E Venta' })).toBeVisible();
  });
});
