// spec: specs/devoluciones.md
// seed: tests/seed.spec.ts
import { test, expect, clienteUnico, fechaFutura } from '../../fixtures/gamehub';

/** Desplaza una fecha ISO (YYYY-MM-DD) N dias, en UTC, para construir los rangos del filtro. */
function sumarDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

test.describe('Devolucion desde el Historial', () => {
  // Todos estos escenarios leen o mutan el stock de E2E Alquiler: van en serie (Supuesto 2 del plan).
  test.describe.configure({ mode: 'serial' });

  test('Devolución exitosa desde el Historial: notificación, redirección y registro en /returns', async ({
    page,
    api,
  }) => {
    // 1. Referencias y estado inicial: RN-09, RN-10, RN-11 (Gherkin 1). Videojuego `E2E Devolucion`; consume 1 unidad.
    const cliente = clienteUnico();
    const fechaDev = fechaFutura(7);
    const alquiler = await api.crearAlquiler('E2E Devolucion', cliente, 1, fechaDev);
    expect(alquiler.id).toBeGreaterThan(0);
    expect(await api.getDevoluciones(cliente.cedula)).toHaveLength(0);

    // 2. Aplicar la receta D hasta el detalle: `/history`, pestaña `Alquileres`, fila por cédula y `Ver detalles`.
    // Carga limpia después de crear los datos por API (caché de TanStack Query).
    await page.goto('/history');
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
    const filaHistorial = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(filaHistorial).toHaveCount(1);
    await expect(filaHistorial.getByRole('cell', { name: 'alquiler', exact: true })).toBeVisible();
    await expect(filaHistorial.getByRole('cell', { name: '$40000', exact: true })).toBeVisible();
    await expect(filaHistorial.getByRole('cell', { name: fechaDev, exact: true })).toBeVisible();
    await expect(filaHistorial.getByRole('cell', { name: 'alquilado', exact: true })).toBeVisible();
    // Fecha del alquiler (la pone el servidor) para compararla luego con la columna 'Alquiler' de /returns.
    const fechaTrans = (await filaHistorial.getByRole('cell').first().innerText()).trim().slice(0, 10);
    expect(fechaTrans).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    await filaHistorial.getByRole('img', { name: 'Ver detalles' }).click();
    await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeVisible();
    await expect(page.getByText(`${cliente.nombre} ${cliente.apellido}`, { exact: true })).toBeVisible();
    await expect(page.getByText('E2E Devolucion', { exact: true })).toBeVisible();
    await expect(page.getByText('cantidad: 1 x 40000', { exact: true })).toBeVisible();
    await expect(page.getByText('Fecha de Devolución', { exact: true }).locator('..')).toHaveText(
      new RegExp(`^Fecha de Devolución\\s*${fechaDev}$`),
    );
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Realizar Devolucion' })).toBeVisible();

    // 3. Pulsar `Realizar Devolucion` y esperar la respuesta del `POST /api/registro-devoluciones` (registrada antes del clic).
    const respuestaPost = page.waitForResponse(
      (r) => r.request().method() === 'POST' && r.url().includes('/api/registro-devoluciones'),
    );
    await page.getByRole('button', { name: 'Realizar Devolucion' }).click();
    const respuesta = await respuestaPost;
    expect(respuesta.status()).toBe(201);
    const cuerpo = await respuesta.json();
    expect(cuerpo.idTransaccion).toBe(alquiler.id);
    expect(cuerpo.transaccion.id).toBe(alquiler.id);
    // DISCREPANCIA con el plan: la respuesta del POST trae la transacción con `estado: 'alquilado'` (instantánea previa al cambio);
    // el estado real `devuelto` solo se ve en los GET posteriores (se comprueba en el paso 6).
    test.info().annotations.push({
      type: 'observación',
      description:
        'El POST /api/registro-devoluciones responde 201 con transaccion.estado "alquilado" (valor previo al cambio); el estado real "devuelto" solo se ve en los GET posteriores.',
    });
    expect(cuerpo.transaccion.estado).toBe('alquilado');
    await expect(page.getByText('¡Devolución realizada con éxito!')).toBeVisible();
    const contador = page.getByText(/Serás redirigido a la vista de devoluciones en \d+ segundos\.\.\./);
    await expect(contador).toBeVisible();
    const segundos = Number((await contador.innerText()).match(/en (\d+) segundos/)![1]);
    expect(segundos).toBeGreaterThanOrEqual(1);
    expect(segundos).toBeLessThanOrEqual(5);
    await expect(page.getByText('Ir ahora', { exact: true })).toBeVisible();
    // COMPORTAMIENTO OBSERVADO (D8): la notificación no es un role=dialog y el contador usa siempre el plural.
    test.info().annotations.push({
      type: 'observación',
      description:
        'D8: la notificación de devolución no es un role=dialog, "Ir ahora" es un <span> sin rol y el contador usa siempre el plural ("1 segundos...").',
    });
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Realizar Devolucion' })).toBeHidden();

    // 4. Sin pulsar nada, esperar la redirección automática (cuenta atrás de ~5 s, sin tiempos fijos).
    await page.waitForURL(/\/returns$/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Devoluciones' })).toBeVisible();
    await expect(page.getByText('¡Devolución realizada con éxito!')).toHaveCount(0);

    // 5. En `/returns` escribir la cédula en `Buscar cliente` y localizar la fila.
    await page.getByLabel('Buscar cliente').fill(cliente.cedula);
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    const celdas = fila.getByRole('cell');
    await expect(celdas.nth(0)).toHaveText(cliente.cedula);
    await expect(celdas.nth(1)).toHaveText(`${cliente.nombre} ${cliente.apellido}`);
    await expect(celdas.nth(2)).toHaveText(fechaTrans);
    await expect(celdas.nth(3)).toHaveText(/^\d{4}-\d{2}-\d{2}$/);
    await expect(
      fila.getByRole('button', { name: `Ver detalles de la devolucion de ${cliente.cedula}` }),
    ).toBeVisible();
    // COMPORTAMIENTO OBSERVADO (D3): la columna 'Alquiler' muestra la fecha del alquiler, no la de devolución programada.
    test.info().annotations.push({
      type: 'observación',
      description:
        'D3: en /returns la columna "Alquiler" muestra fechaTrans (el día del alquiler), no la fecha de devolución programada (fechaDev); esa fecha no aparece en el listado.',
    });
    await expect(fila).not.toContainText(fechaDev);

    // 6. Verificar el estado por API.
    const devoluciones = await api.getDevoluciones(cliente.cedula);
    expect(devoluciones).toHaveLength(1);
    expect(devoluciones[0].transaccion.id).toBe(alquiler.id);
    expect(devoluciones[0].transaccion.estado).toBe('devuelto');
    const devueltos = await api.getAlquileresPorEstado('devuelto');
    expect(devueltos.map((a) => Number(a.cliente?.cedula))).toContain(Number(cliente.cedula));
    const activos = await api.getAlquileresPorEstado('alquilado');
    expect(activos.map((a) => Number(a.cliente?.cedula))).not.toContain(Number(cliente.cedula));

    // 7. Ir al `Historial` con el enlace (navegación SPA), pestaña `Alquileres` y localizar la fila por cédula.
    await page.getByRole('link', { name: 'Historial' }).click();
    await expect(page).toHaveURL(/\/history$/);
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
    const filaDevuelta = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(filaDevuelta).toHaveCount(1);
    await expect(filaDevuelta.getByRole('cell', { name: 'devuelto', exact: true })).toBeVisible();
    await expect(filaDevuelta.getByRole('cell', { name: fechaDev, exact: true })).toBeVisible();
  });

  test("Un alquiler ya devuelto no ofrece 'Realizar Devolucion' (solo Cancelar)", async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-12, RN-10 (Gherkin 2). Videojuego `E2E Devolucion`; consume 1 unidad.
    const cliente = clienteUnico();
    const alquiler = await api.crearAlquiler('E2E Devolucion', cliente, 1);
    // El plan pedía devolverlo por la UI (receta D + "Ir ahora"); aquí la devolución es solo una precondición
    // (la UI ya se prueba en 1.1 y 1.8), así que se registra por API para evitar la cuenta atrás y la redirección.
    await api.registrarDevolucion(alquiler.id);
    expect(await api.getDevoluciones(cliente.cedula)).toHaveLength(1);

    // 2. Ir al Historial, pestaña `Alquileres`, localizar la fila por cédula y confirmar su estado.
    // Carga limpia después de crear los datos por API (caché de TanStack Query).
    await page.goto('/history');
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    await expect(fila.getByRole('cell', { name: 'alquiler', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: '$40000', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: 'devuelto', exact: true })).toBeVisible();

    // 3. Pulsar `Ver detalles` de esa fila.
    const titulo = page.getByRole('heading', { name: 'Detalle de la Transacción' });
    // El contenedor del modal está dos niveles por encima del título (h2 > div de cabecera > tarjeta del modal).
    const modal = titulo.locator('xpath=../..');
    await fila.getByRole('img', { name: 'Ver detalles' }).click();
    await expect(titulo).toBeVisible();
    await expect(modal.getByText('E2E Devolucion', { exact: true })).toBeVisible();
    await expect(modal.getByText('cantidad: 1 x 40000', { exact: true })).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'Información de la Transacción' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Realizar Devolucion' })).toHaveCount(0);
    await expect(modal.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(modal.getByRole('button')).toHaveCount(1);

    // 4. Pulsar `Cancelar`.
    await modal.getByRole('button', { name: 'Cancelar' }).click();
    await expect(titulo).toBeHidden();
    expect(await api.getDevoluciones(cliente.cedula)).toHaveLength(1);
  });

  test('Una venta no ofrece devolución en el Historial', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-12 (Gherkin 3). Videojuego `E2E Devolucion`; consume 1 unidad (venta creada por API).
    const cliente = clienteUnico();
    const venta = await api.crearTransaccion({ titulo: 'E2E Devolucion', cliente, tipo: 'venta', cant: 1 });
    expect(venta.estado).toBe('vendido');

    // 2. Abrir `/history` (pestaña `Ventas` por defecto), localizar la fila por cédula y pulsar `Ver detalles`.
    // Carga limpia después de crear los datos por API (caché de TanStack Query).
    await page.goto('/history');
    await expect(page.getByRole('tab', { name: 'Ventas' })).toHaveAttribute('aria-selected', 'true');
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    await expect(fila.getByRole('cell', { name: 'venta', exact: true })).toBeVisible();
    await expect(fila.getByRole('cell', { name: '$160000', exact: true })).toBeVisible();
    const titulo = page.getByRole('heading', { name: 'Detalle de la Transacción' });
    // El contenedor del modal está dos niveles por encima del título (h2 > div de cabecera > tarjeta del modal).
    const modal = titulo.locator('xpath=../..');
    await fila.getByRole('img', { name: 'Ver detalles' }).click();
    await expect(titulo).toBeVisible();
    await expect(modal.getByText('Tipo de Transaccion', { exact: true }).locator('..')).toHaveText(
      /^Tipo de Transaccion\s*venta$/,
    );
    await expect(modal.getByText('cantidad: 1 x 160000', { exact: true })).toBeVisible();
    await expect(modal.getByText('Fecha de Devolución', { exact: true }).locator('..')).toHaveText(
      /^Fecha de Devolución\s*N\/A$/,
    );
    await expect(page.getByRole('button', { name: 'Realizar Devolucion' })).toHaveCount(0);
    await expect(modal.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(modal.getByRole('button')).toHaveCount(1);

    // 3. Pulsar `Cancelar`, ir a `/returns` y filtrar por la cédula.
    await modal.getByRole('button', { name: 'Cancelar' }).click();
    await expect(titulo).toBeHidden();
    await page.goto('/returns');
    await expect(page.getByRole('heading', { name: 'Devoluciones' })).toBeVisible();
    await page.getByLabel('Buscar cliente').fill(cliente.cedula);
    await expect(page.getByText('Nada por aquí')).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: cliente.cedula })).toHaveCount(0);
    expect(await api.getDevoluciones(cliente.cedula)).toHaveLength(0);

    // 4. OPCIONAL (POSIBLE BUG D6, no pasa por la UI; al final para no contaminar los pasos anteriores):
    // registrar la devolución de la venta directamente en el backend (el fixture hace el mismo POST que el botón del Historial).
    await api.registrarDevolucion(venta.id);
    // COMPORTAMIENTO OBSERVADO (D6): el backend acepta devolver una venta; RN-12 solo se impone en la UI.
    test.info().annotations.push({
      type: 'bug',
      description:
        'D6: el backend acepta POST /api/registro-devoluciones sobre una venta (201) y la transacción pasa a "devuelto"; RN-12 solo se impone ocultando el botón en la UI. Si el producto corrige la validación (400/409), actualizar este paso.',
    });
    const transacciones = await api.getTransaccionesDeCliente(cliente.cedula);
    expect(transacciones).toHaveLength(1);
    expect(transacciones[0]).toMatchObject({ id: venta.id, tipo: 'venta', estado: 'devuelto' });
  });

  // RN-02 no está implementado (D1): devolver un alquiler no restablece el stock, pero la aserción conserva su forma correcta.
  test.fixme(
    'El stock se restablece al devolver (RN-02)',
    {
      annotation: {
        type: 'bug',
        description:
          'D1 / RN-02: devolver un alquiler no restablece el stock (README lo promete); RegistroDevolucionServiceImpl.save no toca VideoJuegoRepository.',
      },
    },
    async ({ page, api }) => {
      // 1. Referencias y estado inicial: RN-02 (Gherkin 4). Videojuego `E2E Devolucion`; consume 2 unidades.
      const cliente = clienteUnico();
      const stockInicial = await api.getStock('E2E Devolucion');

      // 2. Crear el alquiler por API.
      await api.crearAlquiler('E2E Devolucion', cliente, 2);
      await expect.poll(() => api.getStock('E2E Devolucion')).toBe(stockInicial - 2);

      // 3. Devolverlo por la UI con la receta D y pulsar `Ir ahora`.
      await page.goto('/history');
      await page.getByRole('tab', { name: 'Alquileres' }).click();
      await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
      const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
      await expect(fila).toHaveCount(1);
      await fila.getByRole('img', { name: 'Ver detalles' }).click();
      await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeVisible();
      await page.getByRole('button', { name: 'Realizar Devolucion' }).click();
      await expect(page.getByText('¡Devolución realizada con éxito!')).toBeVisible();
      await page.getByText('Ir ahora', { exact: true }).click();
      await page.waitForURL(/\/returns$/);
      const devoluciones = await api.getDevoluciones(cliente.cedula);
      expect(devoluciones).toHaveLength(1);
      expect(devoluciones[0].transaccion.estado).toBe('devuelto');

      // 4. Verificar el stock por API (ESTE PASO FALLA HOY: se queda en stockInicial - 2) y en la tarjeta del catálogo.
      await expect.poll(() => api.getStock('E2E Devolucion')).toBe(stockInicial);
      await page.goto('/home');
      const tarjeta = page
        .getByTestId('game-card')
        .filter({ has: page.getByRole('heading', { name: 'E2E Devolucion' }) });
      await expect(tarjeta).toHaveAttribute('data-stock', `Stock: ${stockInicial}`);
    },
  );

  test('El detalle de una devolución en /returns muestra la banda verde y solo Cancelar', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-11, RN-12 (caso borde). Videojuego `E2E Devolucion`; consume 1 unidad.
    const cliente = clienteUnico();
    const fechaDev = fechaFutura(7);
    const alquiler = await api.crearAlquiler('E2E Devolucion', cliente, 1, fechaDev);
    // El plan pedía devolverlo por la UI (receta D + "Ir ahora"); aquí es solo una precondición (la UI ya se prueba en 1.1 y 1.8),
    // así que se registra por API para evitar la cuenta atrás y la redirección.
    await api.registrarDevolucion(alquiler.id);
    expect(await api.getDevoluciones(cliente.cedula)).toHaveLength(1);

    // 2. En `/returns`, escribir la cédula en `Buscar cliente`, verificar las cabeceras y pulsar el detalle.
    // Carga limpia después de crear los datos por API (caché de TanStack Query).
    await page.goto('/returns');
    await expect(page.getByRole('heading', { name: 'Devoluciones' })).toBeVisible();
    await page.getByLabel('Buscar cliente').fill(cliente.cedula);
    await expect(page.getByRole('row').filter({ hasText: cliente.cedula })).toHaveCount(1);
    await expect(page.getByRole('columnheader')).toHaveText(['Cédula', 'Cliente', 'Alquiler', 'Devolucion', 'Acciones']);
    const titulo = page.getByRole('heading', { name: 'Detalle de la Transacción' });
    // El contenedor del modal está dos niveles por encima del título (h2 > div de cabecera > tarjeta del modal);
    // se acota a él porque la tabla de fondo repite la cédula y el nombre.
    const modal = titulo.locator('xpath=../..');
    await page.getByRole('button', { name: `Ver detalles de la devolucion de ${cliente.cedula}` }).click();
    await expect(titulo).toBeVisible();

    // 3. Comprobar el contenido del modal.
    await expect(modal.getByText(cliente.cedula, { exact: true })).toBeVisible();
    await expect(modal.getByText(cliente.telefono, { exact: true })).toBeVisible();
    await expect(modal.getByText(`${cliente.nombre} ${cliente.apellido}`, { exact: true })).toBeVisible();
    await expect(modal.getByText(cliente.direccion, { exact: true })).toBeVisible();
    await expect(modal.getByText('Tipo de Transaccion', { exact: true }).locator('..')).toHaveText(
      /^Tipo de Transaccion\s*alquiler$/,
    );
    await expect(modal.getByText('E2E Devolucion', { exact: true })).toBeVisible();
    await expect(modal.getByText('cantidad: 1 x 40000', { exact: true })).toBeVisible();
    await expect(modal.getByText('subtotal', { exact: true }).locator('..')).toHaveText(/^subtotal\s*40000$/);
    await expect(modal.getByText('TOTAL', { exact: true }).locator('..')).toHaveText(/^TOTAL\s*40000$/);
    await expect(modal.getByText('Cantidad de items', { exact: true }).locator('..')).toHaveText(
      /^Cantidad de items\s*1$/,
    );
    await expect(modal.getByText('Devolución Procesada Exitosamente')).toBeVisible();
    // COMPORTAMIENTO OBSERVADO (D10): el detalle en /returns omite el bloque 'Información de la Transacción' y la fecha de devolución.
    test.info().annotations.push({
      type: 'observación',
      description:
        'D10: el detalle de una devolución en /returns omite el bloque "Información de la Transacción" (fecha y hora, fecha de devolución) que sí muestra el detalle del Historial; solo trae la banda verde.',
    });
    await expect(modal.getByText('Información de la Transacción')).toHaveCount(0);
    await expect(modal.getByText('Fecha de Devolución')).toHaveCount(0);
    await expect(modal.getByText(fechaDev)).toHaveCount(0);

    // 4. Comprobar los botones del modal.
    await expect(modal.getByRole('button', { name: 'Realizar Devolucion' })).toHaveCount(0);
    await expect(modal.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(modal.getByRole('button')).toHaveCount(1);

    // 5. Pulsar `Cancelar` y volver a abrir el detalle con el mismo botón.
    await modal.getByRole('button', { name: 'Cancelar' }).click();
    await expect(titulo).toBeHidden();
    await page.getByRole('button', { name: `Ver detalles de la devolucion de ${cliente.cedula}` }).click();
    await expect(titulo).toBeVisible();
    await expect(modal.getByText('Devolución Procesada Exitosamente')).toBeVisible();
    await expect(modal.getByText('cantidad: 1 x 40000', { exact: true })).toBeVisible();
    await expect(modal.getByText(`${cliente.nombre} ${cliente.apellido}`, { exact: true })).toBeVisible();
  });

  test('Filtros de /returns: cédula (parcial), rango de fechas y botón Clean', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-13 (D2, D5). Videojuego `E2E Devolucion`; consume 2 unidades (dos clientes).
    const a = clienteUnico();
    const b = clienteUnico();
    const alquilerA = await api.crearAlquiler('E2E Devolucion', a, 1);
    const alquilerB = await api.crearAlquiler('E2E Devolucion', b, 1);
    // El plan pedía devolver ambos por la UI (receta D + "Ir ahora"); aquí las devoluciones son solo precondición
    // (la UI ya se prueba en 1.1 y 1.8), así que se registran por API para ganar velocidad y estabilidad.
    await api.registrarDevolucion(alquilerA.id);
    await api.registrarDevolucion(alquilerB.id);
    // Carga limpia después de crear los datos por API (caché de TanStack Query).
    await page.goto('/returns');
    await expect(page.getByRole('heading', { name: 'Devoluciones' })).toBeVisible();
    const buscar = page.getByLabel('Buscar cliente');
    const desde = page.getByLabel('Fecha Desde');
    const hasta = page.getByLabel('Fecha Hasta');
    const filaA = page.getByRole('row').filter({ hasText: a.cedula });
    const filaB = page.getByRole('row').filter({ hasText: b.cedula });

    // 2. Escribir la cédula completa de `a` en `Buscar cliente`.
    await buscar.fill(a.cedula);
    await expect(filaA).toHaveCount(1);
    await expect(filaB).toHaveCount(0);
    // POSIBLE BUG (D2): el rango de la paginación es fijo ("1-10") aunque haya un solo resultado.
    test.info().annotations.push({
      type: 'bug',
      description:
        'D2: Returns.jsx muestra siempre "Mostrando 1-10 de N resultados"; con 1 resultado filtrado se ve literalmente "Mostrando 1-10 de 1 resultados".',
    });
    await expect(page.getByText(/Mostrando 1-10 de \d+ resultados/)).toBeVisible();

    // 3. Reemplazar el texto por una subcadena de la cédula de `a` (los 7 primeros dígitos).
    await buscar.fill(a.cedula.slice(0, 7));
    // COMPORTAMIENTO OBSERVADO (D5): el filtro es de tipo "contiene", no una búsqueda exacta.
    test.info().annotations.push({
      type: 'observación',
      description:
        'D5: el filtro de cédula de /returns es de tipo "contiene" (LIKE %x%): una subcadena de la cédula también encuentra la devolución. El filtro de fechas es inclusivo en ambos extremos.',
    });
    await expect(filaA).toHaveCount(1);

    // 4. Pulsar `Clean`.
    await page.getByRole('button', { name: 'Clean' }).click();
    await expect(buscar).toHaveValue('');
    await expect(desde).toHaveValue('');
    await expect(hasta).toHaveValue('');

    // 5. Leer la fecha de devolución de la fila de `a` y derivar `ayer` y `mañana` a partir de ella.
    // Se parte de la fecha de la propia fila (la pone el servidor); cerca de la medianoche del servidor una corrida podría cruzar de día.
    await buscar.fill(a.cedula);
    await expect(filaA).toHaveCount(1);
    const hoy = (await filaA.getByRole('cell').nth(3).innerText()).trim();
    expect(hoy).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const ayer = sumarDias(hoy, -1);
    const manana = sumarDias(hoy, 1);
    await desde.fill(hoy);
    await hasta.fill(hoy);
    // El rango es inclusivo en ambos extremos.
    await expect(filaA).toHaveCount(1);

    // 6. Cambiar el rango: Desde = mañana; Hasta = ayer (sin Desde); Desde = ayer y Hasta = mañana. La cédula de `a` se mantiene.
    await desde.fill(manana);
    await expect(filaA).toHaveCount(0);
    await expect(page.getByText('Nada por aquí')).toBeVisible();
    await desde.fill('');
    await hasta.fill(ayer);
    await expect(filaA).toHaveCount(0);
    await desde.fill(ayer);
    await hasta.fill(manana);
    await expect(filaA).toHaveCount(1);

    // 7. Quitar la cédula de `a` y poner la de `b` (rango amplio) y luego pulsar `Clean`.
    await buscar.fill(b.cedula);
    await expect(filaB).toHaveCount(1);
    await expect(filaA).toHaveCount(0);
    await page.getByRole('button', { name: 'Clean' }).click();
    await expect(buscar).toHaveValue('');
    await expect(desde).toHaveValue('');
    await expect(hasta).toHaveValue('');
    await buscar.fill(a.cedula);
    await expect(filaA).toHaveCount(1);
  });

  test("Tras devolver, el filtro 'Alquileres devueltos' lista el alquiler y 'Alquileres Activos' ya no", async ({
    page,
    api,
  }) => {
    // 1. Referencias y estado inicial: RN-10 (caso borde). Videojuego `E2E Devolucion`; consume 2 unidades.
    const devuelto = clienteUnico();
    const activo = clienteUnico();
    const alquilerDevuelto = await api.crearAlquiler('E2E Devolucion', devuelto, 1);
    await api.crearAlquiler('E2E Devolucion', activo, 1);
    // El plan pedía devolver solo el de `devuelto` por la UI (receta D + "Ir ahora"); aquí es solo una precondición
    // (la UI ya se prueba en 1.1 y 1.8), así que se registra por API.
    await api.registrarDevolucion(alquilerDevuelto.id);
    // Carga limpia después de crear los datos por API; evita arrastrar el bug A12 (filtro de estado al cambiar de pestaña).
    await page.goto('/history');
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');

    // 2. Con el filtro en su valor inicial ('Todos los alquileres'), localizar las dos filas por cédula.
    const filtroEstado = page.getByLabel('Filtrar alquileres por estado');
    await expect(filtroEstado).toHaveValue('todos');
    const filaDevuelto = page.getByRole('row').filter({ hasText: devuelto.cedula });
    const filaActivo = page.getByRole('row').filter({ hasText: activo.cedula });
    await expect(filaDevuelto).toHaveCount(1);
    await expect(filaDevuelto.getByRole('cell', { name: 'devuelto', exact: true })).toBeVisible();
    await expect(filaActivo).toHaveCount(1);
    await expect(filaActivo.getByRole('cell', { name: 'alquilado', exact: true })).toBeVisible();

    // 3. Seleccionar 'Alquileres Activos'.
    await filtroEstado.selectOption({ label: 'Alquileres Activos' });
    await expect(filtroEstado).toHaveValue('alquilado');
    await expect(filaActivo).toHaveCount(1);
    await expect(filaDevuelto).toHaveCount(0);

    // 4. Seleccionar 'Alquileres devueltos'. No se afirma que la lista esté vacía de otros clientes.
    await filtroEstado.selectOption({ label: 'Alquileres devueltos' });
    await expect(filtroEstado).toHaveValue('devuelto');
    await expect(filaDevuelto).toHaveCount(1);
    await expect(filaDevuelto.getByRole('cell', { name: 'devuelto', exact: true })).toBeVisible();
    await expect(filaActivo).toHaveCount(0);

    // 5. Verificar por API. No se cambia a la pestaña Ventas y de vuelta con un filtro distinto de 'Todos' (bug A12).
    const devueltos = (await api.getAlquileresPorEstado('devuelto')).map((a) => Number(a.cliente?.cedula));
    expect(devueltos).toContain(Number(devuelto.cedula));
    expect(devueltos).not.toContain(Number(activo.cedula));
    const activos = (await api.getAlquileresPorEstado('alquilado')).map((a) => Number(a.cliente?.cedula));
    expect(activos).toContain(Number(activo.cedula));
    expect(activos).not.toContain(Number(devuelto.cedula));
  });

  test("'Ir ahora' adelanta la redirección sin esperar la cuenta atrás", async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-09 (caso borde). Videojuego `E2E Devolucion`; consume 1 unidad. Alquiler creado por API.
    const cliente = clienteUnico();
    await api.crearAlquiler('E2E Devolucion', cliente, 1);

    // 2. Aplicar la receta D hasta pulsar `Realizar Devolucion` y esperar la notificación.
    await page.goto('/history');
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
    const fila = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(fila).toHaveCount(1);
    await fila.getByRole('img', { name: 'Ver detalles' }).click();
    await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeVisible();
    await page.getByRole('button', { name: 'Realizar Devolucion' }).click();
    await expect(page.getByText('¡Devolución realizada con éxito!')).toBeVisible();
    await expect(page.getByText(/Serás redirigido a la vista de devoluciones en \d+ segundos\.\.\./)).toBeVisible();
    await expect(page).toHaveURL(/\/history$/);
    // COMPORTAMIENTO OBSERVADO (D8): "Ir ahora" es un <span> con onClick, sin rol de enlace ni de botón.
    test.info().annotations.push({
      type: 'observación',
      description:
        'D8: la notificación de devolución no es un role=dialog y "Ir ahora" es un <span> sin rol de enlace/botón: solo se localiza por texto (accesibilidad).',
    });
    await expect(page.getByRole('link', { name: 'Ir ahora' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Ir ahora' })).toHaveCount(0);

    // 3. Pulsar `Ir ahora` inmediatamente.
    await page.getByText('Ir ahora', { exact: true }).click();
    // La cuenta atrás dura 5 s: con un timeout menor se demuestra que la navegación se adelantó.
    await page.waitForURL(/\/returns$/, { timeout: 4_000 });
    await expect(page.getByRole('heading', { name: 'Devoluciones' })).toBeVisible();
    await expect(page.getByText('¡Devolución realizada con éxito!')).toHaveCount(0);
    await page.getByLabel('Buscar cliente').fill(cliente.cedula);
    await expect(page.getByRole('row').filter({ hasText: cliente.cedula })).toHaveCount(1);
    expect(await api.getDevoluciones(cliente.cedula)).toHaveLength(1);

    // 4. Navegar a `Inicio` y comprobar que el temporizador de la notificación no provoca una segunda redirección a `/returns`.
    await page.getByRole('link', { name: 'Inicio' }).click();
    await expect(page).toHaveURL(/\/home$/);
    // La cuenta atrás original (5 s) ya habría vencido durante estos 6 s: si hubiera una segunda navegación, waitForURL la detectaría.
    await expect(page.waitForURL(/\/returns$/, { timeout: 6_000 })).rejects.toThrow();
    await expect(page).toHaveURL(/\/home$/);
  });

  test("Las tarjetas 'Total Devoluciones', 'Este Mes' y 'Hoy' suben al devolver", async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-11 (caso borde, D9). Videojuego `E2E Devolucion`; consume 1 unidad.
    // No se afirman valores absolutos: otros workers pueden devolver a la vez. El "antes" se lee por API (la tarjeta muestra 0 mientras carga).
    const cliente = clienteUnico();
    await api.crearAlquiler('E2E Devolucion', cliente, 1);
    const totalAntes = await api.getTotalDevoluciones();

    // 2. Aplicar la receta D y `Ir ahora`; esperar la redirección y leer las tarjetas.
    // Carga limpia después de crear los datos por API (caché de TanStack Query).
    await page.goto('/history');
    await page.getByRole('tab', { name: 'Alquileres' }).click();
    await expect(page.getByRole('tab', { name: 'Alquileres' })).toHaveAttribute('aria-selected', 'true');
    const filaHistorial = page.getByRole('row').filter({ hasText: cliente.cedula });
    await expect(filaHistorial).toHaveCount(1);
    await filaHistorial.getByRole('img', { name: 'Ver detalles' }).click();
    await expect(page.getByRole('heading', { name: 'Detalle de la Transacción' })).toBeVisible();
    await page.getByRole('button', { name: 'Realizar Devolucion' }).click();
    await expect(page.getByText('¡Devolución realizada con éxito!')).toBeVisible();
    await page.getByText('Ir ahora', { exact: true }).click();
    await page.waitForURL(/\/returns$/);
    await expect(page.getByRole('heading', { name: 'Devoluciones' })).toBeVisible();
    const tarjeta = (nombre: 'Total Devoluciones' | 'Este Mes' | 'Hoy') =>
      page.getByText(nombre, { exact: true }).locator('xpath=following-sibling::span');
    const total = tarjeta('Total Devoluciones');
    const mes = tarjeta('Este Mes');
    const hoy = tarjeta('Hoy');
    await expect.poll(async () => Number(await total.innerText())).toBeGreaterThanOrEqual(totalAntes + 1);
    await expect.poll(async () => Number(await mes.innerText())).toBeGreaterThanOrEqual(1);
    await expect.poll(async () => Number(await hoy.innerText())).toBeGreaterThanOrEqual(1);
    // La devolución es de hoy y del mes en curso: 'Hoy' y 'Este Mes' no pueden superar al total
    // (se lee el total al final porque solo crece mientras otros workers devuelven).
    await expect
      .poll(async () => {
        const valorMes = Number(await mes.innerText());
        const valorHoy = Number(await hoy.innerText());
        const valorTotal = Number(await total.innerText());
        return valorMes <= valorTotal && valorHoy <= valorTotal;
      })
      .toBe(true);

    // 3. Comparar con la API.
    await expect.poll(() => api.getTotalDevoluciones()).toBeGreaterThanOrEqual(totalAntes + 1);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Devoluciones' })).toBeVisible();
    await expect.poll(async () => Number(await total.innerText())).toBeGreaterThanOrEqual(totalAntes + 1);
    await page.getByLabel('Buscar cliente').fill(cliente.cedula);
    await expect(page.getByRole('row').filter({ hasText: cliente.cedula })).toHaveCount(1);

    // 4. Escribir una cédula inexistente en `Buscar cliente` y releer las tarjetas.
    await page.getByLabel('Buscar cliente').fill('000000001');
    await expect(page.getByText('Nada por aquí')).toBeVisible();
    // COMPORTAMIENTO OBSERVADO (D4): las tarjetas no reaccionan al filtro; reflejan totales globales.
    test.info().annotations.push({
      type: 'observación',
      description:
        'D4: las tarjetas de /returns no cambian con el filtro de cédula (siguen mostrando los totales globales) y el estado vacío dice "El registro de devoluciones esta vacio!" aunque existan devoluciones.',
    });
    await expect.poll(async () => Number(await total.innerText())).toBeGreaterThanOrEqual(totalAntes + 1);
    await expect.poll(async () => Number(await mes.innerText())).toBeGreaterThanOrEqual(1);
    await expect.poll(async () => Number(await hoy.innerText())).toBeGreaterThanOrEqual(1);
  });
});
