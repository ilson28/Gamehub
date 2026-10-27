// spec: specs/venta.md
// seed: tests/seed.spec.ts
import { test, expect } from '../../fixtures/gamehub';

test.describe('Carrito, cantidades y confirmación', () => {
  test('La notificación de éxito no está visible antes de vender', async ({ page }) => {
    // 1. Referencias y estado inicial: H1. Contexto nuevo en `/cart`, sin interacción previa; no usa ni consume ningún videojuego.
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Carrito de Compras' })).toBeVisible();

    // 2. Localizar `getByRole('heading', { name: '¡Transacción exitosa!' })` sin haber realizado ninguna venta.
    const titulo = page.getByRole('heading', { name: '¡Transacción exitosa!' });
    // El elemento existe en el DOM...
    await expect(titulo).toHaveCount(1);
    await expect(page.getByText('La transacción se ha procesado correctamente.')).toHaveCount(1);
    // ...pero su contenedor `fixed` tiene opacidad 0 (oculto con opacity-0 + translate-x).
    const notificacion = titulo.locator('xpath=ancestor::div[contains(@class, "fixed")]');
    await expect(notificacion).toHaveCSS('opacity', '0');

    // H1: `toBeVisible()` por sí solo NO es una aserción fiable: pasa aunque la notificación esté oculta.
    test.info().annotations.push({
      type: 'observación',
      description:
        'H1: la notificación de éxito/error está siempre en el DOM con opacity-0, por lo que toBeVisible() pasa antes de vender; verificar siempre toHaveCSS("opacity", "1").',
    });
    await expect(titulo).toBeVisible();
    await expect(notificacion).not.toHaveCSS('opacity', '1');
  });
});
