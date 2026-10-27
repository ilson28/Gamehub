// spec: specs/venta.md
// seed: tests/seed.spec.ts
import { test, expect, clienteUnico } from '../../fixtures/gamehub';

test.describe('Venta exitosa', () => {
  // Las tres ventas descuentan stock de E2E Venta: van en serie para que las aserciones relativas no compitan.
  test.describe.configure({ mode: 'serial' });

  test('Venta exitosa descuenta el stock y queda en el historial', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-01, RN-04, RN-05, RN-06. Videojuego `E2E Venta` (precio 200000). Consume 2 unidades.
    const cliente = clienteUnico();
    const inicial = await api.getStock('E2E Venta');
    // Las 3 ventas de este grupo consumen 5 unidades y el backend no deja reponer stock sin subir una imagen:
    // si ya se gastó (corrida anterior sin reiniciar), falla aquí con la causa y no a mitad de la prueba.
    expect(inicial, 'E2E Venta tiene menos de 5 unidades: reinicia el backend E2E (:8090) para recrear el seed').toBeGreaterThanOrEqual(5);

    // 2. Ir a `/home`. En la tarjeta `E2E Venta` pulsar 1 vez el botón `+`.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Venta' }) });
    await expect(tarjeta).toHaveAttribute('data-stock', `Stock: ${inicial}`);
    await tarjeta.getByRole('button', { name: '+', exact: true }).click();
    await expect(tarjeta.getByRole('spinbutton')).toHaveValue('2');

    // 3. Pulsar `Agregar E2E Venta al carrito` y luego el enlace `Carrito`.
    await page.getByRole('button', { name: 'Agregar E2E Venta al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Venta' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eliminar E2E Venta del carrito' })).toBeVisible();
    const resumenVideojuegos = page.locator('p', { hasText: /^Videojuegos$/ }).locator('..');
    const resumenTipo = page.locator('p', { hasText: /^Tipo$/ }).locator('..');
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*1$/);
    await expect(resumenTipo).toHaveText(/^Tipo\s*venta$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$400000$/);

    // 4. Comprobar que el radio `Venta` está marcado y completar el formulario del cliente.
    await expect(page.getByRole('radio', { name: 'Venta' })).toBeChecked();
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);
    await expect(page.getByText(/obligatori[oa]|Debe tener/)).toHaveCount(0);
    await expect(resumenTotal).toHaveText(/^Total\s*\$400000$/);

    // 5. Pulsar `Finalizar Transaccion`.
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    const confirmar = page.getByRole('button', { name: 'Confirmar transaccion' });
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeVisible();
    await expect(confirmar).toBeVisible();
    await expect(page.getByText(cliente.cedula, { exact: true })).toBeVisible();
    await expect(page.getByText(cliente.telefono, { exact: true })).toBeVisible();
    await expect(page.getByText(`${cliente.nombre} ${cliente.apellido}`, { exact: true })).toBeVisible();
    await expect(page.getByText('Tipo de Transaccion', { exact: true }).locator('..')).toHaveText(
      /^Tipo de Transaccion\s*venta$/,
    );
    await expect(page.getByText('cantidad: 2 x 200000', { exact: true })).toBeVisible();
    await expect(page.getByText('subtotal', { exact: true }).locator('..')).toHaveText(/^subtotal\s*400000$/);
    await expect(page.getByText('TOTAL', { exact: true }).locator('..')).toHaveText(/^TOTAL\s*400000$/);
    await expect(page.getByText('Cantidad de items', { exact: true }).locator('..')).toHaveText(
      /^Cantidad de items\s*2$/,
    );

    // 6. Pulsar `Confirmar transaccion`.
    await confirmar.click();
    // La notificación está siempre en el DOM con opacity-0: se verifica la opacidad del contenedor `fixed`.
    const notificacion = page
      .getByRole('heading', { name: '¡Transacción exitosa!' })
      .locator('xpath=ancestor::div[contains(@class, "fixed")]');
    await expect(notificacion).toHaveCSS('opacity', '1');
    await expect(notificacion.getByText('La transacción se ha procesado correctamente.')).toBeVisible();
    await expect(confirmar).toBeHidden();
    await expect(page.getByText('El carrito esta vacio')).toBeVisible();
    await expect(page.getByText('Agrega videojuegos desde la pagina de Inicio')).toBeVisible();
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*0$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$0$/);
    await expect(page.getByLabel('Cedula')).toHaveValue('');
    await expect(page.getByLabel('Nombre')).toHaveValue('');
    await expect(page.getByRole('button', { name: 'Finalizar Transaccion' })).toBeDisabled();

    // 7. Verificar el stock por API.
    await expect.poll(() => api.getStock('E2E Venta')).toBe(inicial - 2);
    const transacciones = await api.getTransaccionesDeCliente(cliente.cedula);
    expect(transacciones).toHaveLength(1);
    expect(transacciones[0]).toMatchObject({ tipo: 'venta', total: 400000 });

    // 9. Esperar ~5 s tras la confirmación (permanecer en `/cart`): la notificación vuelve a opacidad 0.
    await expect(notificacion).toHaveCSS('opacity', '0', { timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'Finalizar Transaccion' })).toBeDisabled();

    // 8. Ir a `Historial` (pestaña `Ventas` activa) y localizar la fila por la cédula.
    await page.getByRole('link', { name: 'Historial' }).click();
    await expect(page).toHaveURL(/\/history$/);
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    const hoy = new Date().toLocaleDateString('en-CA');
    await expect(fila.getByRole('cell', { name: 'venta', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: '$400000', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell').first()).toContainText(hoy);

    // Pulsar `Ver detalles` y comprobar el detalle de la venta.
    await fila.getByRole('img', { name: 'Ver detalles' }).click();
    await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeVisible();
    await expect(page.getByText('cantidad: 2 x 200000', { exact: true })).toBeVisible();
    await expect(page.getByText(`${cliente.nombre} ${cliente.apellido}`, { exact: true })).toBeVisible();
    await expect(page.getByText('Fecha de Devolución', { exact: true }).locator('..')).toHaveText(
      /^Fecha de Devolución\s*N\/A$/,
    );
  });

  test('Venta de cantidad mínima con cédula de 7 dígitos y teléfono de 10 dígitos', async ({ page, api }) => {
    // 1. Referencias y estado inicial: VAL-01, VAL-02, RN-01, RN-04. Videojuego `E2E Venta`, consume 1 unidad.
    const base = clienteUnico();
    const cliente = { ...base, cedula: '1' + base.cedula.slice(-6) };
    expect(cliente.cedula).toHaveLength(7);
    expect(cliente.telefono).toHaveLength(10);
    const inicial = await api.getStock('E2E Venta');

    // 2. En `/home` pulsar `Agregar E2E Venta al carrito` sin tocar la cantidad y navegar a `Carrito`.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Venta al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Venta' })).toBeVisible();
    const resumenVideojuegos = page.locator('p', { hasText: /^Videojuegos$/ }).locator('..');
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*1$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$200000$/);

    // 3. Llenar el formulario con la cédula de 7 dígitos y el teléfono de 10 dígitos. Pulsar `Finalizar Transaccion`.
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();

    // No se muestra ningún mensaje de validación y se abre el modal de confirmación.
    await expect(page.getByText('Debe tener minimo 7 digitos')).toBeHidden();
    await expect(page.getByText('Debe tener 10 digitos')).toBeHidden();
    await expect(page.getByText(/es obligatori[oa]/)).toHaveCount(0);
    const confirmar = page.getByRole('button', { name: 'Confirmar transaccion' });
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeVisible();
    await expect(confirmar).toBeVisible();
    await expect(page.getByText('cantidad: 1 x 200000', { exact: true })).toBeVisible();
    await expect(page.getByText('TOTAL', { exact: true }).locator('..')).toHaveText(/^TOTAL\s*200000$/);

    // 4. Pulsar `Confirmar transaccion`.
    await confirmar.click();
    // La notificación está siempre en el DOM con opacity-0: se verifica la opacidad del contenedor `fixed`.
    const notificacion = page
      .getByRole('heading', { name: '¡Transacción exitosa!' })
      .locator('xpath=ancestor::div[contains(@class, "fixed")]');
    await expect(notificacion).toHaveCSS('opacity', '1');
    await expect(confirmar).toBeHidden();
    await expect(page.getByText('El carrito esta vacio')).toBeVisible();
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*0$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$0$/);
    await expect.poll(() => api.getStock('E2E Venta')).toBe(inicial - 1);

    // 5. Abrir `/history` y buscar la fila por la cédula de 7 dígitos.
    await page.getByRole('link', { name: 'Historial' }).click();
    await expect(page).toHaveURL(/\/history$/);
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    await expect(fila.getByRole('cell', { name: cliente.cedula, exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: 'venta', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: '$200000', exact: true })).toBeVisible();
  });

  test('Segunda venta al mismo cliente reutiliza al cliente existente', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-04, RN-01, RN-06. Videojuego `E2E Venta`, consume 2 unidades (1 por cada venta) con la MISMA cédula.
    const cliente = clienteUnico();
    const inicial = await api.getStock('E2E Venta');
    const confirmar = page.getByRole('button', { name: 'Confirmar transaccion' });
    const finalizar = page.getByRole('button', { name: 'Finalizar Transaccion' });
    // La notificación está siempre en el DOM con opacity-0: se verifica la opacidad del contenedor `fixed`.
    const notificacion = page
      .getByRole('heading', { name: '¡Transacción exitosa!' })
      .locator('xpath=ancestor::div[contains(@class, "fixed")]');

    // 2. Venta A: en `/home` agregar `E2E Venta` (cantidad 1), ir a Carrito, llenar el formulario con `cliente` completo y confirmar.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Venta al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Venta' })).toBeVisible();
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);
    await finalizar.click();
    await expect(page.getByText('cantidad: 1 x 200000', { exact: true })).toBeVisible();
    await confirmar.click();

    await expect(notificacion).toHaveCSS('opacity', '1');
    await expect(confirmar).toBeHidden();
    await expect(page.getByText('El carrito esta vacio')).toBeVisible();
    // Esperar a que la notificación se oculte (~5 s): mientras es visible, `Finalizar Transaccion` está deshabilitado.
    await expect(notificacion).toHaveCSS('opacity', '0', { timeout: 10_000 });

    // 3. Venta B: volver a `/home`, agregar `E2E Venta` (cantidad 1) y llenar el formulario con la MISMA cédula y datos distintos.
    await page.getByRole('link', { name: 'Inicio' }).click();
    await expect(page).toHaveURL(/\/home$/);
    await page.getByRole('button', { name: 'Agregar E2E Venta al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Venta' })).toBeVisible();
    const otroTelefono = cliente.telefono === '3222222222' ? '3333333333' : '3222222222';
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill('Otro');
    await page.getByLabel('Apellidos').fill('Distinto');
    await page.getByLabel('Direccion').fill('Calle 2');
    await page.getByLabel('Telefono').fill(otroTelefono);
    await finalizar.click();
    await expect(page.getByText('cantidad: 1 x 200000', { exact: true })).toBeVisible();
    await confirmar.click();
    // La venta no es rechazada por cédula repetida.
    await expect(notificacion).toHaveCSS('opacity', '1');
    await expect(confirmar).toBeHidden();
    await expect(page.getByText('El carrito esta vacio')).toBeVisible();

    // 4. Verificar el stock por API.
    await expect.poll(() => api.getStock('E2E Venta')).toBe(inicial - 2);
    const transacciones = await api.getTransaccionesDeCliente(cliente.cedula);
    expect(transacciones).toHaveLength(2);

    // 5. Abrir `/history` (pestaña Ventas) y filtrar las filas por la cédula.
    await expect(notificacion).toHaveCSS('opacity', '0', { timeout: 10_000 });
    await page.getByRole('link', { name: 'Historial' }).click();
    await expect(page).toHaveURL(/\/history$/);
    const filas = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(filas).toHaveCount(2);
    for (const fila of await filas.all()) {
      await expect(fila.getByRole('cell', { name: 'venta', exact: true })).toBeVisible();
      await expect(fila.getByRole('cell', { name: '$200000', exact: true })).toBeVisible();
    }

    // COMPORTAMIENTO OBSERVADO (H7): al abrir `Ver detalles` en las ventas, el cliente conserva los datos de la venta A.
    test.info().annotations.push({
      type: 'observación',
      description:
        'H7: si la cédula ya existe, la venta se asocia al cliente existente y NO actualiza sus datos: el detalle de la venta B muestra nombre, dirección y teléfono de la venta A.',
    });
    for (let i = 0; i < 2; i++) {
      await filas.nth(i).getByRole('img', { name: 'Ver detalles' }).click();
      await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeVisible();
      await expect(page.getByText(`${cliente.nombre} ${cliente.apellido}`, { exact: true })).toBeVisible();
      await expect(page.getByText('Cra 51b #79-56', { exact: true })).toBeVisible();
      await expect(page.getByText(cliente.telefono, { exact: true })).toBeVisible();
      await expect(page.getByText('Otro Distinto', { exact: true })).toBeHidden();
      await expect(page.getByText('Calle 2', { exact: true })).toBeHidden();
      await expect(page.getByText(otroTelefono, { exact: true })).toBeHidden();
      await page.getByRole('button', { name: 'Cancelar' }).click();
      await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeHidden();
    }
  });
});
