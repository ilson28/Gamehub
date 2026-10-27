// spec: specs/venta.md
// seed: tests/seed.spec.ts
import { test, expect, clienteUnico } from '../../fixtures/gamehub';

test.describe('Carrito, cantidades y confirmación', () => {
  test('Cancelar el modal de confirmación no vende ni vacía el carrito', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-01. Videojuego `E2E Validaciones`; agregar el juego (cantidad 2), abrir `/cart` y llenar el formulario.
    const cliente = clienteUnico();
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Validaciones' }) });
    await tarjeta.getByRole('button', { name: '+', exact: true }).click();
    await expect(tarjeta.getByRole('spinbutton')).toHaveValue('2');
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);

    // 2. Pulsar `Finalizar Transaccion`.
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    const confirmar = page.getByRole('button', { name: 'Confirmar transaccion' });
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeVisible();
    await expect(confirmar).toBeVisible();
    await expect(page.getByText('cantidad: 2 x 180000', { exact: true })).toBeVisible();
    await expect(page.getByText('TOTAL', { exact: true }).locator('..')).toHaveText(/^TOTAL\s*360000$/);

    // 3. Pulsar `Cancelar`.
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(confirmar).toBeHidden();
    // El carrito aún contiene `E2E Validaciones` y el Total es `$360000`.
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eliminar E2E Validaciones del carrito' })).toBeVisible();
    await expect(page.locator('p', { hasText: /^Total$/ }).locator('..')).toHaveText(/^Total\s*\$360000$/);
    // Los campos del formulario conservan los datos escritos.
    await expect(page.getByLabel('Cedula')).toHaveValue(cliente.cedula);
    await expect(page.getByLabel('Nombre')).toHaveValue(cliente.nombre);
    await expect(page.getByLabel('Apellidos')).toHaveValue(cliente.apellido);
    await expect(page.getByLabel('Direccion')).toHaveValue(cliente.direccion);
    await expect(page.getByLabel('Telefono')).toHaveValue(cliente.telefono);
    // No se muestra la notificación de éxito (opacidad 0, aunque el nodo siempre esté en el DOM).
    const notificacion = page
      .getByRole('heading', { name: '¡Transacción exitosa!' })
      .locator('xpath=ancestor::div[contains(@class, "fixed")]');
    await expect(notificacion).toHaveCSS('opacity', '0');
    await expect(page.getByRole('button', { name: 'Finalizar Transaccion' })).toBeEnabled();
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);

    // 4. Abrir `/history` (pestaña Ventas) y buscar la cédula del cliente.
    await page.getByRole('link', { name: 'Historial' }).click();
    await expect(page).toHaveURL(/\/history$/);
    await expect(page.getByRole('heading', { name: 'Historial de Transacciones' })).toBeVisible();
    // La tabla ya cargó (el encabezado de columnas existe) y no hay ninguna fila con la cédula.
    await expect(page.getByRole('columnheader', { name: 'Cédula Cliente' })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: cliente.cedula })).toHaveCount(0);
  });
});
