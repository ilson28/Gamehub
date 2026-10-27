// spec: specs/venta.md
// seed: tests/seed.spec.ts
import { test, expect } from '../../fixtures/gamehub';

test.describe('Carrito, cantidades y confirmación', () => {
  test('El backend rechaza una cédula de 11 dígitos y la UI conserva el carrito', async ({ page, api }) => {
    // 1. Referencias y estado inicial: VAL-01 y manejo de errores (H5). Videojuego `E2E Validaciones` (el envío es rechazado, no descuenta stock). Agregar el juego (cantidad 3) y abrir `/cart`.
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Validaciones' }) });
    const botonMas = tarjeta.getByRole('button', { name: '+', exact: true });
    await botonMas.click();
    await botonMas.click();
    await expect(tarjeta.getByRole('spinbutton')).toHaveValue('3');
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();

    // 2. Llenar Cedula = '12345678901' (11 dígitos) y el resto de campos; pulsar `Finalizar Transaccion`.
    await page.getByLabel('Cedula').fill('12345678901');
    await page.getByLabel('Nombre').fill('Prueba');
    await page.getByLabel('Apellidos').fill('Overflow');
    await page.getByLabel('Direccion').fill('Calle 1');
    await page.getByLabel('Telefono').fill('3001234567');
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();

    // COMPORTAMIENTO OBSERVADO (H5): el formulario NO muestra error y se abre el modal de confirmación.
    const confirmar = page.getByRole('button', { name: 'Confirmar transaccion' });
    await expect(page.getByText(/obligatori[oa]|Debe tener/)).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeVisible();
    await expect(confirmar).toBeVisible();
    await expect(page.getByText('cantidad: 3 x 180000', { exact: true })).toBeVisible();
    await expect(page.getByText('TOTAL', { exact: true }).locator('..')).toHaveText(/^TOTAL\s*540000$/);

    // 3. Pulsar `Confirmar transaccion`.
    test.info().annotations.push({
      type: 'bug',
      description:
        'H5: una cédula de 11 dígitos pasa la validación del formulario, pero POST /api/transacciones responde 500 (desborda Integer) y la UI solo muestra el mensaje genérico "Error en la transacción". Esperado: validar la longitud máxima en el formulario (VAL-01). Si se corrige, actualizar este escenario.',
    });
    const [respuesta] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/transacciones') && r.request().method() === 'POST'),
      confirmar.click(),
    ]);
    expect(respuesta.status()).toBe(500);

    // La notificación está siempre en el DOM con opacity-0: se verifica la opacidad del contenedor `fixed`.
    // El mismo contenedor cambia su título según el resultado: tras el error ya no existe "¡Transacción exitosa!".
    const notificacionError = page
      .getByRole('heading', { name: 'Error en la transacción' })
      .locator('xpath=ancestor::div[contains(@class, "fixed")]');
    await expect(notificacionError).toHaveCSS('opacity', '1');
    await expect(
      notificacionError.getByText(
        'No se pudo procesar la transacción. Por favor verifica los datos e intenta nuevamente.',
      ),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: '¡Transacción exitosa!' })).toHaveCount(0);
    // El modal de confirmación se cierra.
    await expect(confirmar).toBeHidden();

    // 4. Verificar el estado tras el error.
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eliminar E2E Validaciones del carrito' })).toBeVisible();
    await expect(page.locator('p', { hasText: /^Total$/ }).locator('..')).toHaveText(/^Total\s*\$540000$/);
    await expect(page.getByLabel('Cedula')).toHaveValue('12345678901');
    await expect(page.getByLabel('Nombre')).toHaveValue('Prueba');
    await expect(page.getByLabel('Apellidos')).toHaveValue('Overflow');
    await expect(page.getByLabel('Direccion')).toHaveValue('Calle 1');
    await expect(page.getByLabel('Telefono')).toHaveValue('3001234567');
  });
});
