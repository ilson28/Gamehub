import { test, expect } from '../fixtures/gamehub';
import { ADMIN } from '../fixtures/env';

// Estas pruebas parten sin sesión.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Autenticación', () => {
  test('el administrador inicia sesión con credenciales válidas', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill(ADMIN.username);
    await page.getByLabel('Password').fill(ADMIN.password);
    await page.getByRole('button', { name: 'Acceder al sistema' }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
  });

  test('credenciales inválidas muestran una alerta y no dan acceso', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill(ADMIN.username);
    await page.getByLabel('Password').fill('incorrecta');
    await page.getByRole('button', { name: 'Acceder al sistema' }).click();

    await expect(page.getByRole('alert')).toContainText('Credenciales inválidas');
    await expect(page).toHaveURL(/\/login$/);
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });

  test('una ruta privada sin sesión redirige a /welcome', async ({ page }) => {
    await page.goto('/history');
    await expect(page).toHaveURL(/\/welcome$/);
  });
});
