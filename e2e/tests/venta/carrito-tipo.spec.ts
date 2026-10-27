// spec: specs/venta.md
// seed: tests/seed.spec.ts
import { test, expect, clienteUnico } from '../../fixtures/gamehub';

test.describe('Carrito, cantidades y confirmación', () => {
  test('El tipo Alquiler recalcula el total y vuelve a Venta sin alterar el carrito', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-05. Videojuego `E2E Validaciones` (venta 180000, alquiler 45000); NO completa ningún alquiler. Agregar el juego con cantidad 3 y abrir `/cart`.
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

    const resumenTipo = page.locator('p', { hasText: /^Tipo$/ }).locator('..');
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    const campoFecha = page.getByLabel('Fecha de devolución');

    // 2. Verificar el tipo por defecto.
    await expect(page.getByRole('radio', { name: 'Venta' })).toBeChecked();
    await expect(resumenTipo).toHaveText(/^Tipo\s*venta$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$540000$/);
    await expect(campoFecha).toBeHidden();

    // 3. Seleccionar el radio `Alquiler`.
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();
    await expect(resumenTipo).toHaveText(/^Tipo\s*alquiler$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$135000$/);
    // La línea del carrito muestra el precio de alquiler unitario.
    await expect(page.locator('p', { hasText: /^\$45000$/ })).toBeVisible();
    await expect(campoFecha).toBeVisible();

    // 4. Volver a seleccionar el radio `Venta`.
    await page.getByRole('radio', { name: 'Venta' }).click();
    await expect(page.getByRole('radio', { name: 'Venta' })).toBeChecked();
    await expect(resumenTipo).toHaveText(/^Tipo\s*venta$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$540000$/);
    await expect(page.locator('p', { hasText: /^\$180000$/ })).toBeVisible();
    await expect(campoFecha).toBeHidden();
    // El carrito no se alteró: sigue el mismo juego.
    await expect(page.getByRole('button', { name: 'Eliminar E2E Validaciones del carrito' })).toBeVisible();
    await expect(page.locator('p', { hasText: /^Videojuegos$/ }).locator('..')).toHaveText(/^Videojuegos\s*1$/);

    // 5. Verificar el stock.
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
  });

  test('Alquiler sin fecha de devolución no abre el modal', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-03/RN-05. Videojuego `E2E Validaciones`; agregar el juego, abrir `/cart`, seleccionar `Alquiler` y llenar el formulario sin fecha de devolución.
    const cliente = clienteUnico();
    const inicial = await api.getStock('E2E Validaciones');
    // Registra cualquier intento de crear una transacción.
    const peticionesTransaccion: string[] = [];
    page.on('request', (peticion) => {
      if (peticion.method() === 'POST' && peticion.url().includes('/api/transacciones')) {
        peticionesTransaccion.push(peticion.url());
      }
    });

    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();
    const campoFecha = page.getByLabel('Fecha de devolución');
    await expect(campoFecha).toBeVisible();
    await expect(campoFecha).toHaveValue('');
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);

    // 2. Pulsar `Finalizar Transaccion`.
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    // COMPORTAMIENTO OBSERVADO (H8): no pasa nada visible: el modal no se abre y no hay mensaje que pida la fecha.
    test.info().annotations.push({
      type: 'observación',
      description:
        'H8: en Alquiler, "Finalizar Transaccion" sin fecha de devolución no hace nada: no abre el modal ni muestra mensaje alguno.',
    });
    await expect(page.getByRole('button', { name: 'Confirmar transaccion' })).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeHidden();
    await expect(page.getByText(/obligatori[oa]|Debe tener/)).toHaveCount(0);
    await expect(page).toHaveURL(/\/cart$/);
    // El carrito y el formulario se conservan.
    await expect(page.getByRole('button', { name: 'Eliminar E2E Validaciones del carrito' })).toBeVisible();
    await expect(page.getByLabel('Cedula')).toHaveValue(cliente.cedula);
    // No se creó ninguna transacción y el stock no cambia.
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
    expect(peticionesTransaccion).toHaveLength(0);
  });
});
