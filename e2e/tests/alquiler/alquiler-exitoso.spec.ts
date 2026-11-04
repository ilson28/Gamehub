// spec: specs/alquiler.md
// seed: tests/seed.spec.ts
import { test, expect, clienteUnico, fechaFutura, fechaLocal } from '../../fixtures/gamehub';

test.describe('Alquiler exitoso', () => {
  // Todos estos escenarios leen o mutan el stock de E2E Alquiler: van en serie (Supuesto 2 del plan).
  test.describe.configure({ mode: 'serial' });


  test('Alquiler exitoso descuenta stock y queda en el historial con su fecha de devolucion', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-01, RN-04, RN-05, RN-06, RN-07, RN-08. Videojuego `E2E Alquiler` (alquiler 40000, venta 150000). Consume 2 unidades.
    const cliente = clienteUnico();
    const fechaDev = fechaFutura(7);
    const inicial = await api.getStock('E2E Alquiler');

    // 2. Ir a `/home`. En la tarjeta `E2E Alquiler` pulsar 1 vez `+`, luego `Agregar E2E Alquiler al carrito` y navegar a `Carrito`.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Alquiler' }) });
    await expect(tarjeta).toHaveAttribute('data-stock', `Stock: ${inicial}`);
    await tarjeta.getByRole('button', { name: '+', exact: true }).click();
    await expect(tarjeta.getByRole('spinbutton')).toHaveValue('2');
    await page.getByRole('button', { name: 'Agregar E2E Alquiler al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Alquiler' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eliminar E2E Alquiler del carrito' })).toBeVisible();
    const resumenVideojuegos = page.locator('p', { hasText: /^Videojuegos$/ }).locator('..');
    const resumenTipo = page.locator('p', { hasText: /^Tipo$/ }).locator('..');
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*1$/);
    await expect(resumenTipo).toHaveText(/^Tipo\s*venta$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$300000$/);

    // 3. Seleccionar el radio `Alquiler` y escribir la fecha de devolución.
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();
    const campoFecha = page.getByLabel('Fecha de devolución');
    await expect(campoFecha).toBeVisible();
    await campoFecha.fill(fechaDev);
    await expect(campoFecha).toHaveValue(fechaDev);
    await expect(resumenTipo).toHaveText(/^Tipo\s*alquiler$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$80000$/);
    // La línea del carrito muestra el precio de alquiler unitario.
    await expect(page.locator('p', { hasText: /^\$40000$/ })).toBeVisible();

    // 4. Llenar el formulario del cliente y pulsar `Finalizar Transaccion`.
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);
    await expect(page.getByText(/obligatori[oa]|Debe tener/)).toHaveCount(0);
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    const confirmar = page.getByRole('button', { name: 'Confirmar transaccion' });
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeVisible();
    await expect(confirmar).toBeVisible();
    await expect(page.getByText(cliente.cedula, { exact: true })).toBeVisible();
    await expect(page.getByText(cliente.telefono, { exact: true })).toBeVisible();
    await expect(page.getByText(`${cliente.nombre} ${cliente.apellido}`, { exact: true })).toBeVisible();
    await expect(page.getByText('Tipo de Transaccion', { exact: true }).locator('..')).toHaveText(
      /^Tipo de Transaccion\s*alquiler$/,
    );
    await expect(page.getByText('cantidad: 2 x 40000', { exact: true })).toBeVisible();
    await expect(page.getByText('subtotal', { exact: true }).locator('..')).toHaveText(/^subtotal\s*80000$/);
    await expect(page.getByText('TOTAL', { exact: true }).locator('..')).toHaveText(/^TOTAL\s*80000$/);
    await expect(page.getByText('Cantidad de items', { exact: true }).locator('..')).toHaveText(
      /^Cantidad de items\s*2$/,
    );
    // COMPORTAMIENTO OBSERVADO (A5): el modal no muestra la fecha de devolución elegida.
    test.info().annotations.push({
      type: 'observación',
      description:
        'A5: el modal "Confirmar Transacción" de un alquiler no muestra la fecha de devolución elegida (sí aparece en el detalle del Historial).',
    });
    await expect(page.getByText(fechaDev, { exact: true })).toHaveCount(0);

    // 5. Pulsar `Confirmar transaccion` y capturar la respuesta del `POST /api/transacciones`.
    const respuestaPost = page.waitForResponse(
      (r) => r.request().method() === 'POST' && r.url().includes('/api/transacciones'),
    );
    await confirmar.click();
    const respuesta = await respuestaPost;
    expect(respuesta.status()).toBe(201);
    const { data } = await respuesta.json();
    expect(data).toMatchObject({ tipo: 'alquiler', estado: 'alquilado', total: 80000, fechaDev });
    expect(Number(data.cliente.cedula)).toBe(Number(cliente.cedula));
    // COMPORTAMIENTO OBSERVADO (A11): el POST responde `transJuegos: null`; las líneas solo se ven en el GET por tipo y en el detalle del Historial.
    test.info().annotations.push({
      type: 'observación',
      description:
        'A11: la respuesta del POST /api/transacciones trae transJuegos null; las líneas del alquiler solo se ven en GET /api/transacciones/type/alquiler o en el detalle del Historial.',
    });
    expect(data.transJuegos).toBeNull();

    // La notificación está siempre en el DOM con opacity-0: se verifica la opacidad del contenedor `fixed` (A8).
    const notificacion = page
      .getByRole('heading', { name: '¡Transacción exitosa!' })
      .locator('xpath=ancestor::div[contains(@class, "fixed")]');
    await expect(notificacion).toHaveCSS('opacity', '1');
    await expect(notificacion.getByText('La transacción se ha procesado correctamente.')).toBeVisible();
    await expect(confirmar).toBeHidden();
    await expect(page.getByText('El carrito esta vacio')).toBeVisible();
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*0$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$0$/);
    await expect(page.getByLabel('Cedula')).toHaveValue('');
    await expect(page.getByLabel('Nombre')).toHaveValue('');
    await expect(page.getByRole('button', { name: 'Finalizar Transaccion' })).toBeDisabled();
    // COMPORTAMIENTO OBSERVADO (A4): el tipo sigue en Alquiler y la fecha de devolución conserva el valor anterior.
    test.info().annotations.push({
      type: 'observación',
      description:
        'A4: tras un alquiler exitoso el carrito y el formulario se vacían, pero el tipo sigue en "Alquiler" y "Fecha de devolución" conserva la fecha anterior mientras no se recargue la página.',
    });
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();
    await expect(resumenTipo).toHaveText(/^Tipo\s*alquiler$/);
    await expect(campoFecha).toHaveValue(fechaDev);

    // 6. Verificar el stock y el estado por API.
    await expect.poll(() => api.getStock('E2E Alquiler')).toBe(inicial - 2);
    const activos = await api.getAlquileresPorEstado('alquilado');
    const alquiler = activos.find((a) => Number(a.cliente?.cedula) === Number(cliente.cedula));
    expect(alquiler, 'el alquiler nuevo debe estar en la lista de alquileres activos').toBeDefined();
    expect(alquiler).toMatchObject({ tipo: 'alquiler', estado: 'alquilado', total: 80000, fechaDev });

    // 9. Esperar ~5 s tras la confirmación (permanecer en `/cart`): la notificación vuelve a opacidad 0.
    await expect(notificacion).toHaveCSS('opacity', '0', { timeout: 10_000 });

    // 7. Ir a `Historial`, pulsar la pestaña `Alquileres` y localizar la fila por la cédula.
    await page.getByRole('link', { name: 'Historial' }).click();
    await expect(page).toHaveURL(/\/history$/);
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'Ventas' })).toHaveAttribute('aria-selected', 'false');
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    const hoy = new Date().toLocaleDateString('en-CA');
    await expect(fila.getByRole('cell').first()).toContainText(hoy);
    await expect(fila.getByRole('cell', { name: 'alquiler', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: '$80000', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: fechaDev, exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: 'alquilado', exact: true })).toBeVisible();

    // 8. Pulsar `Ver detalles` de esa fila y comprobar el detalle del alquiler.
    await fila.getByRole('img', { name: 'Ver detalles' }).click();
    await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeVisible();
    await expect(page.getByText(`${cliente.nombre} ${cliente.apellido}`, { exact: true })).toBeVisible();
    await expect(page.getByText('cantidad: 2 x 40000', { exact: true })).toBeVisible();
    await expect(page.getByText('TOTAL', { exact: true }).locator('..')).toHaveText(/^TOTAL\s*80000$/);
    await expect(page.getByText('Tipo de Transaccion', { exact: true }).locator('..')).toHaveText(
      /^Tipo de Transaccion\s*alquiler$/,
    );
    await expect(page.getByText('Fecha de Devolución', { exact: true }).locator('..')).toHaveText(
      new RegExp(`^Fecha de Devolución\\s*${fechaDev}$`),
    );
    // Un alquiler muestra `Realizar Devolucion` (no se pulsa: la devolución está fuera de alcance).
    await expect(page.getByRole('button', { name: 'Realizar Devolucion' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeHidden();
  });


  test('Alquiler con fecha elegida y luego cambiado a Venta se registra como venta sin fecha de devolucion', async ({
    page,
    api,
  }) => {
    // 1. Referencias y estado inicial: RN-05, RN-07, RN-08 (borde del selector de tipo). Videojuego `E2E Alquiler`, consume 1 unidad.
    const cliente = clienteUnico();
    const inicial = await api.getStock('E2E Alquiler');

    // 2. En `/home` agregar `E2E Alquiler`, ir a `Carrito`, seleccionar `Alquiler`, escribir una fecha y volver a `Venta`.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Alquiler al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Alquiler' })).toBeVisible();
    const resumenTipo = page.locator('p', { hasText: /^Tipo$/ }).locator('..');
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    const campoFecha = page.getByLabel('Fecha de devolución');
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    await expect(campoFecha).toBeVisible();
    await campoFecha.fill(fechaFutura(5));
    await expect(campoFecha).toHaveValue(fechaFutura(5));
    await expect(resumenTotal).toHaveText(/^Total\s*\$40000$/);
    await page.getByRole('radio', { name: 'Venta' }).click();
    await expect(page.getByRole('radio', { name: 'Venta' })).toBeChecked();
    await expect(campoFecha).toBeHidden();
    await expect(resumenTipo).toHaveText(/^Tipo\s*venta$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$150000$/);

    // 3. Llenar el formulario con `cliente`, pulsar `Finalizar Transaccion` y `Confirmar transaccion`.
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
      /^Tipo de Transaccion\s*venta$/,
    );
    await expect(page.getByText('cantidad: 1 x 150000', { exact: true })).toBeVisible();
    const peticionPost = page.waitForRequest(
      (r) => r.method() === 'POST' && r.url().includes('/api/transacciones'),
    );
    const respuestaPost = page.waitForResponse(
      (r) => r.request().method() === 'POST' && r.url().includes('/api/transacciones'),
    );
    await confirmar.click();
    // COMPORTAMIENTO OBSERVADO (A6): la fecha escrita no se filtra a la venta; el POST va con tipo "venta" y fechaDev null.
    test.info().annotations.push({
      type: 'observación',
      description:
        'A6: si se elige Alquiler, se escribe una fecha y se vuelve a Venta, el POST se envía con tipo "venta" y fechaDev null; el backend la registra como "vendido" (comportamiento correcto).',
    });
    const cuerpo = (await peticionPost).postDataJSON();
    expect(cuerpo.tipo).toBe('venta');
    expect(cuerpo.fechaDev).toBeNull();
    const respuesta = await respuestaPost;
    expect(respuesta.status()).toBe(201);
    const { data } = await respuesta.json();
    expect(data).toMatchObject({ tipo: 'venta', estado: 'vendido', total: 150000 });
    expect(data.fechaDev ?? null).toBeNull();

    // La notificación está siempre en el DOM con opacity-0: se verifica la opacidad del contenedor `fixed`.
    const notificacion = page
      .getByRole('heading', { name: '¡Transacción exitosa!' })
      .locator('xpath=ancestor::div[contains(@class, "fixed")]');
    await expect(notificacion).toHaveCSS('opacity', '1');
    await expect(confirmar).toBeHidden();
    await expect(page.getByText('El carrito esta vacio')).toBeVisible();
    await expect(resumenTotal).toHaveText(/^Total\s*\$0$/);

    // 4. Verificar el stock y el historial.
    await expect.poll(() => api.getStock('E2E Alquiler')).toBe(inicial - 1);
    await expect(notificacion).toHaveCSS('opacity', '0', { timeout: 10_000 });
    await page.getByRole('link', { name: 'Historial' }).click();
    await expect(page).toHaveURL(/\/history$/);
    await expect(page.getByRole('tab', { name: 'Ventas' })).toHaveAttribute('aria-selected', 'true');
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    await expect(fila.getByRole('cell', { name: 'venta', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: '$150000', exact: true })).toBeVisible();
    await fila.getByRole('img', { name: 'Ver detalles' }).click();
    await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeVisible();
    await expect(page.getByText('cantidad: 1 x 150000', { exact: true })).toBeVisible();
    await expect(page.getByText('Fecha de Devolución', { exact: true }).locator('..')).toHaveText(
      /^Fecha de Devolución\s*N\/A$/,
    );
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeHidden();

    // En la pestaña `Alquileres` no existe ninguna fila con esa cédula.
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('columnheader', { name: 'Fecha Devolución' })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: cliente.cedula })).toHaveCount(0);
  });


  test('Una fecha de devolucion pasada se rechaza en el formulario y no se envia nada', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-08 (A1). Videojuego `E2E Alquiler`; consume 0 unidades (el envío se bloquea en el formulario).
    const cliente = clienteUnico();
    const inicial = await api.getStock('E2E Alquiler');
    const fechaPasada = fechaLocal(-3);
    const peticionesTransaccion: string[] = [];
    page.on('request', (peticion) => {
      if (peticion.method() === 'POST' && peticion.url().includes('/api/transacciones')) {
        peticionesTransaccion.push(peticion.url());
      }
    });

    // 2. En `/home` agregar `E2E Alquiler` (cantidad 1), abrir `Carrito`, seleccionar `Alquiler`, escribir la fecha y llenar el formulario.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Alquiler al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Alquiler' })).toBeVisible();
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    const campoFecha = page.getByLabel('Fecha de devolución');
    await expect(campoFecha).toBeVisible();
    // A1 corregido: el campo exige fecha futura (min = mañana) y avisa cuando no se cumple.
    await expect(campoFecha).toHaveAttribute('min', fechaLocal(1));
    await campoFecha.fill(fechaPasada);
    await expect(campoFecha).toHaveValue(fechaPasada);
    const aviso = page.getByRole('alert').filter({ hasText: 'La fecha de devolución debe ser posterior a hoy' });
    await expect(aviso).toBeVisible();
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);
    await expect(resumenTotal).toHaveText(/^Total\s*\$40000$/);

    // 3. Pulsar `Finalizar Transaccion`: el modal de confirmación no se abre.
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeHidden();

    // 4. Verificar el estado: no se envió nada, el stock no cambió y el carrito y el formulario se conservan.
    expect(peticionesTransaccion).toHaveLength(0);
    await expect.poll(() => api.getStock('E2E Alquiler')).toBe(inicial);
    await expect(page.getByRole('button', { name: 'Eliminar E2E Alquiler del carrito' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();
    await expect(campoFecha).toHaveValue(fechaPasada);
    await expect(page.getByLabel('Cedula')).toHaveValue(cliente.cedula);
    await expect(page.getByLabel('Nombre')).toHaveValue(cliente.nombre);
    const activos = await api.getAlquileresPorEstado('alquilado');
    expect(activos.map((a) => Number(a.cliente?.cedula))).not.toContain(Number(cliente.cedula));

    // 5. Corregir la fecha: el aviso desaparece y el modal se abre (NO se confirma, para no consumir stock).
    await campoFecha.fill(fechaLocal(1));
    await expect(aviso).toBeHidden();
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeVisible();
    expect(peticionesTransaccion).toHaveLength(0);
  });


  test('La fecha de devolucion de hoy tambien se rechaza en el formulario', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-08 (A3). Videojuego `E2E Alquiler`; consume 0 unidades (el envío se bloquea en el formulario).
    const cliente = clienteUnico();
    const inicial = await api.getStock('E2E Alquiler');
    const hoy = fechaLocal(0);
    const peticionesTransaccion: string[] = [];
    page.on('request', (peticion) => {
      if (peticion.method() === 'POST' && peticion.url().includes('/api/transacciones')) {
        peticionesTransaccion.push(peticion.url());
      }
    });

    // 2. En `/home` agregar `E2E Alquiler` (cantidad 1), abrir `Carrito`, seleccionar `Alquiler`, escribir la fecha y llenar el formulario.
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Alquiler al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Alquiler' })).toBeVisible();
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    await page.getByRole('radio', { name: 'Alquiler' }).click();
    const campoFecha = page.getByLabel('Fecha de devolución');
    await expect(campoFecha).toBeVisible();
    // A3 corregido: el campo exige fecha futura (min = mañana) y avisa cuando no se cumple.
    await expect(campoFecha).toHaveAttribute('min', fechaLocal(1));
    await campoFecha.fill(hoy);
    await expect(campoFecha).toHaveValue(hoy);
    const aviso = page.getByRole('alert').filter({ hasText: 'La fecha de devolución debe ser posterior a hoy' });
    await expect(aviso).toBeVisible();
    await page.getByLabel('Cedula').fill(cliente.cedula);
    await page.getByLabel('Nombre').fill(cliente.nombre);
    await page.getByLabel('Apellidos').fill(cliente.apellido);
    await page.getByLabel('Direccion').fill(cliente.direccion);
    await page.getByLabel('Telefono').fill(cliente.telefono);
    await expect(resumenTotal).toHaveText(/^Total\s*\$40000$/);

    // 3. Pulsar `Finalizar Transaccion`: el modal de confirmación no se abre.
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeHidden();

    // 4. Verificar el estado: no se envió nada, el stock no cambió y el carrito y el formulario se conservan.
    expect(peticionesTransaccion).toHaveLength(0);
    await expect.poll(() => api.getStock('E2E Alquiler')).toBe(inicial);
    await expect(page.getByRole('button', { name: 'Eliminar E2E Alquiler del carrito' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Alquiler' })).toBeChecked();
    await expect(campoFecha).toHaveValue(hoy);
    await expect(page.getByLabel('Cedula')).toHaveValue(cliente.cedula);
    await expect(page.getByLabel('Nombre')).toHaveValue(cliente.nombre);
    const activos = await api.getAlquileresPorEstado('alquilado');
    expect(activos.map((a) => Number(a.cliente?.cedula))).not.toContain(Number(cliente.cedula));

    // 5. Corregir la fecha: el aviso desaparece y el modal se abre (NO se confirma, para no consumir stock).
    await campoFecha.fill(fechaLocal(1));
    await expect(aviso).toBeHidden();
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    await expect(page.getByRole('heading', { name: 'Confirmar Transacción' })).toBeVisible();
    expect(peticionesTransaccion).toHaveLength(0);
  });


  test('La pestana Alquileres muestra columnas extra y separa alquileres de ventas', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-06, RN-07, RN-08. Videojuego `E2E Alquiler`; consume 1 unidad (alquiler creado por API como precondición).
    const cliente = clienteUnico();
    const fechaDev = fechaFutura(10);
    const alquiler = await api.crearAlquiler('E2E Alquiler', cliente, 1, fechaDev);
    expect(alquiler.id).toBeGreaterThan(0);

    // 2. Abrir `/history` y comprobar la pestaña por defecto.
    await page.goto('/history');
    await expect(page.getByRole('heading', { name: 'Historial de Transacciones' })).toBeVisible();
    const pestanaVentas = page.getByRole('tab', { name: 'Ventas' });
    const pestanaAlquileres = page.getByRole('tab', { name: 'Alquileres' });
    await expect(pestanaVentas).toHaveAttribute('aria-selected', 'true');
    await expect(pestanaAlquileres).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('columnheader')).toHaveText([
      'Fecha y Hora',
      'Cédula Cliente',
      'Tipo',
      'Total',
      'Acciones',
    ]);
    await expect(page.getByRole('row').filter({ hasText: cliente.cedula })).toHaveCount(0);

    // 3. Pulsar la pestaña `Alquileres`.
    await pestanaAlquileres.click();
    await expect(pestanaAlquileres).toHaveAttribute('aria-selected', 'true');
    await expect(pestanaVentas).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('columnheader')).toHaveText([
      'Fecha y Hora',
      'Cédula Cliente',
      'Tipo',
      'Total',
      'Fecha Devolución',
      'Estado',
      'Acciones',
    ]);
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    await expect(fila.getByRole('cell', { name: cliente.cedula, exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: 'alquiler', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: '$40000', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: fechaDev, exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: 'alquilado', exact: true })).toBeVisible();

    // 4. Usar el filtro `Filtrar por fecha`: la fecha del alquiler y luego `2020-01-01`.
    // Se filtra con la fecha que muestra la propia fila (la del servidor) para no depender de la zona horaria del runner.
    const fechaFila = (await fila.getByRole('cell').first().innerText()).trim().slice(0, 10);
    expect(fechaFila).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const filtroFecha = page.getByLabel('Filtrar por fecha');
    await filtroFecha.fill(fechaFila);
    await expect(filtroFecha).toHaveValue(fechaFila);
    await expect(fila).toHaveCount(1);
    await filtroFecha.fill('2020-01-01');
    await expect(filtroFecha).toHaveValue('2020-01-01');
    await expect(fila).toHaveCount(0);

    // 5. Recargar la página: la pestaña activa vuelve a `Ventas` (no se persiste) y el alquiler sigue sin aparecer allí.
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Historial de Transacciones' })).toBeVisible();
    // COMPORTAMIENTO OBSERVADO (A9): la pestaña activa no se persiste.
    test.info().annotations.push({
      type: 'observación',
      description: 'A9: tras recargar /history la pestaña activa vuelve a "Ventas" (no se persiste).',
    });
    await expect(pestanaVentas).toHaveAttribute('aria-selected', 'true');
    await expect(pestanaAlquileres).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('row').filter({ hasText: cliente.cedula })).toHaveCount(0);
  });


  test('El filtro de estado: Alquileres Activos lista el alquiler nuevo y Alquileres devueltos no', async ({
    page,
    api,
  }) => {
    // 1. Referencias y estado inicial: RN-06, RN-07. Videojuego `E2E Alquiler`; consume 1 unidad (alquiler creado por API). No se devuelve el alquiler.
    const cliente = clienteUnico();
    await api.crearAlquiler('E2E Alquiler', cliente, 1);

    // 2. Abrir `/history`, pulsar la pestaña `Alquileres` y leer el filtro de estado.
    await page.goto('/history');
    await expect(page.getByRole('heading', { name: 'Historial de Transacciones' })).toBeVisible();
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
    const filtroEstado = page.getByLabel('Filtrar alquileres por estado');
    await expect(filtroEstado).toBeVisible();
    await expect(filtroEstado).toHaveValue('todos');
    await expect(filtroEstado.locator('option')).toHaveText([
      'Todos los alquileres',
      'Alquileres Activos',
      'Alquileres devueltos',
    ]);
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    await expect(fila.getByRole('cell', { name: 'alquilado', exact: true })).toBeVisible();

    // 3. Seleccionar `Alquileres Activos`.
    await filtroEstado.selectOption({ label: 'Alquileres Activos' });
    await expect(fila).toHaveCount(1);
    await expect(fila.getByRole('cell', { name: 'alquilado', exact: true })).toBeVisible();

    // 4. Seleccionar `Alquileres devueltos`: la fila del cliente no aparece (no se afirma que la tabla esté vacía: otros planes pueden tener devoluciones).
    await filtroEstado.selectOption({ label: 'Alquileres devueltos' });
    await expect(filtroEstado).toHaveValue('devuelto');
    await expect(fila).toHaveCount(0);

    // 5. Volver a `Todos los alquileres`, cambiar a la pestaña `Ventas` y de regreso a `Alquileres`.
    await filtroEstado.selectOption({ label: 'Todos los alquileres' });
    await expect(filtroEstado).toHaveValue('todos');
    await expect(fila).toHaveCount(1);
    await filtroEstado.selectOption({ label: 'Alquileres devueltos' });
    await expect(fila).toHaveCount(0);
    await page.getByRole('tab', { name: 'Ventas' }).click();
    await expect(page.getByRole('tab', { name: 'Ventas' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByLabel('Filtrar alquileres por estado')).toHaveCount(0);
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    // A12 corregido: handleTab reinicia rentalFilter y el <select> es controlado, así que el filtro visible
    // ("Todos los alquileres") coincide con la consulta y la fila del cliente vuelve a listarse.
    const filtroTrasVolver = page.getByLabel('Filtrar alquileres por estado');
    await expect(filtroTrasVolver).toHaveValue('todos');
    await expect(fila).toHaveCount(1);

    // Reelegir "Alquileres Activos" sigue funcionando.
    await filtroTrasVolver.selectOption({ label: 'Alquileres Activos' });
    await expect(fila).toHaveCount(1);

    // Por API: el alquiler está entre los activos y no entre los devueltos.
    const activos = await api.getAlquileresPorEstado('alquilado');
    expect(activos.map((a) => Number(a.cliente?.cedula))).toContain(Number(cliente.cedula));
    const devueltos = await api.getAlquileresPorEstado('devuelto');
    expect(devueltos.map((a) => Number(a.cliente?.cedula))).not.toContain(Number(cliente.cedula));
  });
});
