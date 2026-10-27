// spec: specs/venta.md
// seed: tests/seed.spec.ts
import { test, expect } from '../../fixtures/gamehub';

test.describe('Juego agotado', () => {
  test('Un videojuego sin stock no se puede agregar al carrito', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-03. Videojuego `E2E Agotado` (stock 0, precio 120000). Ir a `/home` con carrito vacío.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();

    // 2. Localizar la tarjeta con `getByTestId('game-card')` filtrada por el encabezado `E2E Agotado`.
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Agotado' }) });
    await expect(tarjeta).toBeVisible();
    await expect(tarjeta).toHaveAttribute('data-stock', 'Stock: 0');
    expect(await api.getStock('E2E Agotado')).toBe(0);

    // 3. Localizar `Agregar E2E Agotado al carrito`: el botón está deshabilitado.
    await expect(page.getByRole('button', { name: 'Agregar E2E Agotado al carrito' })).toBeDisabled();

    // En contraste, el botón de otra tarjeta con stock está habilitado.
    await expect(page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' })).toBeEnabled();

    // 4. Ir a `Carrito`: nada del juego agotado llegó al carrito.
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByText('El carrito esta vacio')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finalizar Transaccion' })).toBeDisabled();
  });
});
