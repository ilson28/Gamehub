// spec: specs/devoluciones.md
// seed: tests/seed.spec.ts
import { test, expect } from '../../fixtures/gamehub';

test.describe('Filtros y estado vacio de Devoluciones', () => {
  test('Filtrar por una cédula inexistente muestra el estado vacío y Clean restablece los filtros', async ({
    page,
    api,
  }) => {
    // 1. Referencias y estado inicial: RN-13 (D4). Consume 0 unidades y no crea datos.
    // No se afirma si hay devoluciones previas (otros planes pueden haberlas creado); solo se lee si existen, antes de cargar la página.
    const hayDevoluciones = (await api.getDevoluciones()).length > 0;
    // Registra los GET del listado (se excluyen /total-devoluciones, /devoluciones-mes y /devoluciones-dia por la ruta exacta).
    const consultas: URL[] = [];
    page.on('request', (peticion) => {
      const url = new URL(peticion.url());
      if (peticion.method() === 'GET' && url.pathname === '/api/registro-devoluciones') consultas.push(url);
    });
    await page.goto('/returns');

    // 2. Comprobar el encabezado y los controles.
    await expect(page.getByRole('heading', { name: 'Devoluciones' })).toBeVisible();
    for (const nombre of ['Total Devoluciones', 'Este Mes', 'Hoy']) {
      const valor = page.getByText(nombre, { exact: true }).locator('xpath=following-sibling::span');
      await expect(valor).toBeVisible();
      await expect(valor).toHaveText(/^\d+$/);
    }
    const buscar = page.getByLabel('Buscar cliente');
    const desde = page.getByLabel('Fecha Desde');
    const hasta = page.getByLabel('Fecha Hasta');
    const limpiar = page.getByRole('button', { name: 'Clean' });
    await expect(buscar).toBeVisible();
    await expect(buscar).toHaveAttribute('placeholder', 'Cédula');
    await expect(desde).toBeVisible();
    await expect(hasta).toBeVisible();
    await expect(limpiar).toBeVisible();
    await expect(buscar).toHaveValue('');
    await expect(desde).toHaveValue('');
    await expect(hasta).toHaveValue('');
    // La carga inicial consulta el listado sin filtros (el parámetro `cedula` viaja vacío).
    await expect.poll(() => consultas.length).toBeGreaterThanOrEqual(1);
    expect(consultas[0].searchParams.get('cedula')).toBe('');

    // 3. Escribir la cédula inexistente `000000001` (ninguna cédula de `clienteUnico()` empieza por 0).
    await buscar.fill('000000001');
    await expect(page.getByText('Nada por aquí')).toBeVisible();
    await expect(page.getByText('El registro de devoluciones esta vacio!')).toBeVisible();
    await expect(page.getByRole('table')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Pagina siguiente' })).toHaveCount(0);
    await expect.poll(() => consultas.at(-1)?.searchParams.get('cedula')).toBe('000000001');
    // POSIBLE BUG (D4): el mensaje dice "vacio" como si no hubiera registros cuando solo no hay coincidencias.
    test.info().annotations.push({
      type: 'bug',
      description:
        'D4: con una cédula sin coincidencias el estado vacío dice "El registro de devoluciones esta vacio!" aunque existan devoluciones, y las tarjetas siguen mostrando los totales globales.',
    });

    // 4. Pulsar `Clean`.
    await limpiar.click();
    await expect(buscar).toHaveValue('');
    await expect(desde).toHaveValue('');
    await expect(hasta).toHaveValue('');
    // DISCREPANCIA con el plan: la consulta sin filtros ya está en la caché de TanStack Query (staleTime largo), así que
    // `Clean` no dispara una petición nueva; la última petición registrada sigue llevando la cédula anterior.
    test.info().annotations.push({
      type: 'observación',
      description:
        'Clean no genera una petición nueva al listado (la consulta sin filtros ya está en caché): la última petición registrada sigue con cedula=000000001; el reinicio del filtro se comprueba en el paso 5 (cedula vacía) y por el estado de la lista.',
    });
    expect(consultas.at(-1)?.searchParams.get('cedula')).toBe('000000001');
    if (hayDevoluciones) {
      // Solo si ya existían devoluciones antes de cargar la página: el listado vuelve a mostrar la tabla.
      await expect(page.getByRole('table')).toBeVisible();
      await expect(page.getByText('Nada por aquí')).toHaveCount(0);
    }

    // 5. Probar un rango sin datos: Desde = 2020-01-01 y Hasta = 2020-12-31 (ninguna devolución es de 2020).
    await desde.fill('2020-01-01');
    await hasta.fill('2020-12-31');
    await expect(page.getByText('Nada por aquí')).toBeVisible();
    await expect(page.getByRole('row')).toHaveCount(0);
    await expect
      .poll(() => {
        const ultima = consultas.at(-1);
        return ultima && [ultima.searchParams.get('fromDate'), ultima.searchParams.get('toDate'), ultima.searchParams.get('cedula')];
      })
      .toEqual(['2020-01-01', '2020-12-31', '']);
    await limpiar.click();
    await expect(desde).toHaveValue('');
    await expect(hasta).toHaveValue('');
    await expect(buscar).toHaveValue('');
  });
});
