// spec: specs/alquiler.md
// seed: tests/seed.spec.ts
import { test, expect, clienteUnico, fechaFutura, fechaLocal } from '../../fixtures/gamehub';

test.describe('Carrito de alquiler', () => {
  test('El tipo de transaccion determina el precio: Alquiler usa 40000 y Venta 150000', async ({ page }) => {
    // 1. Referencias y estado inicial: RN-05. Videojuego `E2E Alquiler` (venta 150000, alquiler 40000); no consume stock ni envía nada.
    // Se vigila que no salga ningún POST a /api/transacciones.
    const peticionesTransaccion: string[] = [];
    page.on('request', (peticion) => {
      if (peticion.method() === 'POST' && peticion.url().includes('/api/transacciones')) {
        peticionesTransaccion.push(peticion.url());
      }
    });

    // En `/home` pulsar `+` 2 veces (cantidad 3), `Agregar E2E Alquiler al carrito` y navegar a `Carrito`.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Alquiler' }) });
    const botonMas = tarjeta.getByRole('button', { name: '+', exact: true });
    await botonMas.click();
    await botonMas.click();
    await expect(tarjeta.getByRole('spinbutton')).toHaveValue('3');
    await page.getByRole('button', { name: 'Agregar E2E Alquiler al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Alquiler' })).toBeVisible();

    const resumenVideojuegos = page.locator('p', { hasText: /^Videojuegos$/ }).locator('..');
    const resumenTipo = page.locator('p', { hasText: /^Tipo$/ }).locator('..');
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    const campoFecha = page.getByLabel('Fecha de devolución');

    // 2. Verificar el estado por defecto.
    await expect(page.getByRole('radio', { name: 'Venta' })).toBeChecked();
    await expect(resumenTipo).toHaveText(/^Tipo\s*venta$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$450000$/);
    await expect(campoFecha).toBeHidden();

    // 3. Seleccionar el radio `Alquiler`.
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();
    await expect(resumenTipo).toHaveText(/^Tipo\s*alquiler$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$120000$/);
    // La línea del carrito muestra el precio de alquiler unitario.
    await expect(page.locator('p', { hasText: /^\$40000$/ })).toBeVisible();
    await expect(campoFecha).toBeVisible();
    await expect(campoFecha).toHaveAttribute('type', 'date');
    await expect(campoFecha).toHaveValue('');
    // A1 corregido: el campo exige una fecha estrictamente futura (mínimo: mañana).
    await expect(campoFecha).toHaveAttribute('min', fechaLocal(1));
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*1$/);

    // 4. Volver a seleccionar el radio `Venta`.
    await page.getByRole('radio', { name: 'Venta' }).click();
    await expect(page.getByRole('radio', { name: 'Venta' })).toBeChecked();
    await expect(resumenTipo).toHaveText(/^Tipo\s*venta$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$450000$/);
    await expect(page.locator('p', { hasText: /^\$150000$/ })).toBeVisible();
    await expect(campoFecha).toBeHidden();
    // El carrito no se alteró: sigue el mismo juego.
    await expect(page.getByRole('button', { name: 'Eliminar E2E Alquiler del carrito' })).toBeVisible();
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*1$/);

    // 5. Comprobar que no se envió ninguna petición de transacción.
    expect(peticionesTransaccion).toHaveLength(0);
  });

  test('Recargar /cart devuelve el tipo a Venta pero conserva los juegos y la cantidad', async ({ page }) => {
    // 1. Referencias y estado inicial: RN-05 (A7). Videojuego `E2E Alquiler`; no consume stock ni envía nada.
    // Agregar `E2E Alquiler` con cantidad 3 (dos pulsaciones de `+`), abrir `/cart` y seleccionar `Alquiler`.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Alquiler' }) });
    const botonMas = tarjeta.getByRole('button', { name: '+', exact: true });
    await botonMas.click();
    await botonMas.click();
    await expect(tarjeta.getByRole('spinbutton')).toHaveValue('3');
    await page.getByRole('button', { name: 'Agregar E2E Alquiler al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Alquiler' })).toBeVisible();
    const resumenVideojuegos = page.locator('p', { hasText: /^Videojuegos$/ }).locator('..');
    const resumenTipo = page.locator('p', { hasText: /^Tipo$/ }).locator('..');
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    const campoFecha = page.getByLabel('Fecha de devolución');
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();

    // 2. Escribir una fecha en `Fecha de devolución` y verificar el estado.
    await campoFecha.fill(fechaFutura(7));
    await expect(campoFecha).toHaveValue(fechaFutura(7));
    await expect(resumenTipo).toHaveText(/^Tipo\s*alquiler$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$120000$/);

    // 3. Recargar la página.
    await page.reload();
    await expect(page.getByRole('heading', { name: 'E2E Alquiler' })).toBeVisible();
    // COMPORTAMIENTO OBSERVADO (A7): el tipo no se persiste: tras recargar vuelve a Venta y el total a 3 x 150000.
    test.info().annotations.push({
      type: 'observación',
      description:
        'A7: el tipo de transacción no se persiste; tras recargar /cart vuelve a "Venta" (total 3 x 150000) aunque el carrito y la cantidad se conservan. El usuario podría vender por error lo que quería alquilar.',
    });
    await expect(page.getByRole('radio', { name: 'Venta' })).toBeChecked();
    await expect(resumenTipo).toHaveText(/^Tipo\s*venta$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$450000$/);
    await expect(campoFecha).toBeHidden();
    await expect(page.getByRole('button', { name: 'Eliminar E2E Alquiler del carrito' })).toBeVisible();
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*1$/);
    // localStorage: se conservan los juegos y la cantidad; no hay ninguna clave para el tipo de transacción.
    const { origins } = await page.context().storageState();
    const almacen = Object.fromEntries(
      origins.flatMap((origen) => origen.localStorage).map((entrada) => [entrada.name, entrada.value]),
    );
    expect(Object.keys(almacen).sort()).toEqual(['cart_games', 'cart_transJuegos', 'token']);
    expect(almacen.cart_games).toContain('E2E Alquiler');
    expect(JSON.parse(almacen.cart_transJuegos)).toEqual([expect.objectContaining({ cant: 3 })]);

    // 4. Volver a seleccionar `Alquiler` tras la recarga.
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();
    await expect(resumenTotal).toHaveText(/^Total\s*\$120000$/);
    await expect(campoFecha).toBeVisible();
    // La fecha anterior se perdió: el campo reaparece vacío.
    await expect(campoFecha).toHaveValue('');
  });

  test('Cancelar la confirmacion de un alquiler de 3 unidades no envia nada y conserva el carrito', async ({
    page,
  }) => {
    // 1. Referencias y estado inicial: RN-05, RN-08 (A5). Videojuego `E2E Alquiler`; no consume stock (se cancela siempre).
    // Se vigila que no salga ningún POST /api/transacciones.
    const cliente = clienteUnico();
    const fechaDev = fechaFutura(7);
    const peticionesTransaccion: string[] = [];
    page.on('request', (peticion) => {
      if (peticion.method() === 'POST' && peticion.url().includes('/api/transacciones')) {
        peticionesTransaccion.push(peticion.url());
      }
    });

    // Agregar `E2E Alquiler` con cantidad 3 y abrir `/cart`.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Alquiler' }) });
    const botonMas = tarjeta.getByRole('button', { name: '+', exact: true });
    await botonMas.click();
    await botonMas.click();
    await expect(tarjeta.getByRole('spinbutton')).toHaveValue('3');
    await page.getByRole('button', { name: 'Agregar E2E Alquiler al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Alquiler' })).toBeVisible();
    const resumenVideojuegos = page.locator('p', { hasText: /^Videojuegos$/ }).locator('..');
    const resumenTipo = page.locator('p', { hasText: /^Tipo$/ }).locator('..');
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    const campoFecha = page.getByLabel('Fecha de devolución');

    // 2. Seleccionar `Alquiler`, escribir `fechaDev`, llenar el formulario y pulsar `Finalizar Transaccion`.
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    await expect(campoFecha).toBeVisible();
    await campoFecha.fill(fechaDev);
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    const confirmar = page.getByRole('button', { name: 'Confirmar transaccion' });
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeVisible();
    await expect(confirmar).toBeVisible();
    await expect(page.getByText('Tipo de Transaccion', { exact: true }).locator('..')).toHaveText(
      /^Tipo de Transaccion\s*alquiler$/,
    );
    await expect(page.getByText('cantidad: 3 x 40000', { exact: true })).toBeVisible();
    await expect(page.getByText('subtotal', { exact: true }).locator('..')).toHaveText(/^subtotal\s*120000$/);
    await expect(page.getByText('TOTAL', { exact: true }).locator('..')).toHaveText(/^TOTAL\s*120000$/);
    await expect(page.getByText('Cantidad de items', { exact: true }).locator('..')).toHaveText(
      /^Cantidad de items\s*3$/,
    );
    // COMPORTAMIENTO OBSERVADO (A5): el modal no muestra la fecha de devolución elegida.
    test.info().annotations.push({
      type: 'observación',
      description:
        'A5: el modal "Confirmar Transacción" de un alquiler no muestra la fecha de devolución elegida; el usuario no puede verificarla antes de confirmar.',
    });
    await expect(page.getByText(fechaDev, { exact: true })).toHaveCount(0);

    // 3. Pulsar `Cancelar`.
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(confirmar).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Eliminar E2E Alquiler del carrito' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();
    await expect(resumenTipo).toHaveText(/^Tipo\s*alquiler$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$120000$/);
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*1$/);
    await expect(campoFecha).toHaveValue(fechaDev);
    await expect(page.getByLabel('Cedula')).toHaveValue(cliente.cedula);
    await expect(page.getByLabel('Nombre')).toHaveValue(cliente.nombre);
    await expect(page.getByLabel('Apellidos')).toHaveValue(cliente.apellido);
    await expect(page.getByLabel('Direccion')).toHaveValue(cliente.direccion);
    await expect(page.getByLabel('Telefono')).toHaveValue(cliente.telefono);
    // La notificación está siempre en el DOM con opacity-0: no hubo éxito ni error, el contenedor `fixed` sigue en 0.
    const notificacionExito = page
      .getByRole('heading', { name: '¡Transacción exitosa!' })
      .locator('xpath=ancestor::div[contains(@class, "fixed")]');
    await expect(notificacionExito).toHaveCSS('opacity', '0');
    expect(peticionesTransaccion).toHaveLength(0);

    // 4. Abrir `/history`, pestaña `Alquileres`, y buscar la cédula del cliente.
    await page.getByRole('link', { name: 'Historial' }).click();
    await expect(page).toHaveURL(/\/history$/);
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('columnheader', { name: 'Fecha Devolución' })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: cliente.cedula })).toHaveCount(0);
    expect(peticionesTransaccion).toHaveLength(0);
  });
});
