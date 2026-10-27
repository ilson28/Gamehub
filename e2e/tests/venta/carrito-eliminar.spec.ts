// spec: specs/venta.md
// seed: tests/seed.spec.ts
import { test, expect, clienteUnico } from '../../fixtures/gamehub';

test.describe('Carrito, cantidades y confirmación', () => {
  test('Quitar un juego del carrito lo deja vacío y deshabilita el envío', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-05, RN-06 (sin venta). Videojuego `E2E Validaciones`; agregar el juego (cantidad 1) y abrir `/cart`.
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    const botonEliminar = page.getByRole('button', { name: 'Eliminar E2E Validaciones del carrito' });
    await expect(botonEliminar).toBeVisible();

    // 2. Recargar la página (`page.reload()`).
    await page.reload();
    // El carrito conserva `E2E Validaciones` (persistido en `localStorage`).
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();
    await expect(botonEliminar).toBeVisible();

    // 3. Pulsar `Eliminar E2E Validaciones del carrito`.
    await botonEliminar.click();
    await expect(botonEliminar).toBeHidden();
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toHaveCount(0);
    await expect(page.getByText('El carrito esta vacio')).toBeVisible();
    await expect(page.getByText('Agrega videojuegos desde la pagina de Inicio')).toBeVisible();
    await expect(page.locator('p', { hasText: /^Videojuegos$/ }).locator('..')).toHaveText(/^Videojuegos\s*0$/);
    await expect(page.locator('p', { hasText: /^Total$/ }).locator('..')).toHaveText(/^Total\s*\$0$/);
    await expect(page.getByRole('button', { name: 'Finalizar Transaccion' })).toBeDisabled();

    // `localStorage.cart_games` y `cart_transJuegos` valen `[]`.
    await expect
      .poll(async () => {
        const estado = await page.context().storageState();
        const almacenamiento = estado.origins.flatMap((origen) => origen.localStorage);
        const valor = (nombre: string) => almacenamiento.find((item) => item.name === nombre)?.value;
        return [valor('cart_games'), valor('cart_transJuegos')];
      })
      .toEqual(['[]', '[]']);

    // 4. Volver a `/home` y comprobar el stock.
    await page.getByRole('link', { name: 'Inicio' }).click();
    await expect(page).toHaveURL(/\/home$/);
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Validaciones' }) });
    await expect(tarjeta).toHaveAttribute('data-stock', `Stock: ${inicial}`);
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
  });

  test('Carrito vacío: el botón Finalizar Transaccion está deshabilitado', async ({ page }) => {
    // 1. Referencias y estado inicial: RN-04. Contexto nuevo, sin juegos en el carrito. Ir directamente a `/cart`.
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Carrito de Compras' })).toBeVisible();

    // 2. Observar el carrito vacío y el resumen.
    await expect(page.getByText('El carrito esta vacio')).toBeVisible();
    await expect(page.getByText('Agrega videojuegos desde la pagina de Inicio')).toBeVisible();
    await expect(page.locator('p', { hasText: /^Total$/ }).locator('..')).toHaveText(/^Total\s*\$0$/);
    await expect(page.locator('p', { hasText: /^Videojuegos$/ }).locator('..')).toHaveText(/^Videojuegos\s*0$/);
    await expect(page.locator('p', { hasText: /^Tipo$/ }).locator('..')).toHaveText(/^Tipo\s*venta$/);

    const finalizar = page.getByRole('button', { name: 'Finalizar Transaccion' });
    await expect(finalizar).toBeDisabled();

    // El botón sigue deshabilitado incluso con el formulario completo y válido.
    const cliente = clienteUnico();
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);
    await expect(page.getByLabel('Telefono')).toHaveValue(cliente.telefono);
    await expect(finalizar).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Confirmar transaccion' })).toBeHidden();
  });
});
