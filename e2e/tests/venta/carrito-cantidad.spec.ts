// spec: specs/venta.md
// seed: tests/seed.spec.ts
import { test, expect } from '../../fixtures/gamehub';

test.describe('Carrito, cantidades y confirmación', () => {
  test('Control de cantidad: tope en el stock, mínimo 1, campo de solo lectura y re-agregado', async ({ page, api }) => {
    // 1. Referencias y estado inicial: RN-03, RN-05. Videojuego `E2E Validaciones` (precio 180000); no consume stock.
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    const tarjeta = page
      .getByTestId('game-card')
      .filter({ has: page.getByRole('heading', { name: 'E2E Validaciones' }) });
    const cantidad = tarjeta.getByRole('spinbutton');
    const botonMas = tarjeta.getByRole('button', { name: '+', exact: true });
    const botonMenos = tarjeta.getByRole('button', { name: '-', exact: true });
    await expect(tarjeta).toHaveAttribute('data-stock', `Stock: ${inicial}`);

    // 2. Comprobar el estado inicial de los controles de la tarjeta.
    await expect(cantidad).toHaveValue('1');
    await expect(botonMenos).toBeDisabled();
    // El `spinbutton` es de solo lectura: no se puede usar `fill()`.
    await expect(cantidad).toHaveJSProperty('readOnly', true);

    // 3. Pulsar `+` 12 veces: la cantidad se detiene en el stock (10).
    for (let i = 0; i < 12; i++) {
      await botonMas.click();
    }
    await expect(cantidad).toHaveValue(String(inicial));
    // COMPORTAMIENTO OBSERVADO (H9): el botón `+` no se deshabilita al llegar al tope; simplemente deja de incrementar.
    test.info().annotations.push({
      type: 'observación',
      description: 'H9: al llegar al stock el botón "+" sigue habilitado; solo se detiene el incremento de la cantidad.',
    });
    await expect(botonMas).toBeEnabled();

    // 4. Pulsar `-` 12 veces (solo mientras esté habilitado): la cantidad vuelve a 1.
    for (let i = 0; i < 12; i++) {
      if (await botonMenos.isEnabled()) {
        await botonMenos.click();
      }
    }
    await expect(cantidad).toHaveValue('1');
    await expect(botonMenos).toBeDisabled();

    // 5. Pulsar `+` dos veces (cantidad 3) y `Agregar E2E Validaciones al carrito`; ir a `Carrito`.
    await botonMas.click();
    await botonMas.click();
    await expect(cantidad).toHaveValue('3');
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();
    const resumenVideojuegos = page.locator('p', { hasText: /^Videojuegos$/ }).locator('..');
    const resumenTotal = page.locator('p', { hasText: /^Total$/ }).locator('..');
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*1$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$540000$/);
    // COMPORTAMIENTO OBSERVADO (H3): la línea del carrito muestra el precio unitario, sin la cantidad.
    test.info().annotations.push({
      type: 'observación',
      description:
        'H3: la línea del carrito muestra el precio unitario ($180000) y no la cantidad (3); solo el modal muestra "cantidad: N x precio".',
    });
    await expect(page.locator('p', { hasText: /^\$180000$/ })).toBeVisible();

    // 6. Volver a `/home` (enlace `Inicio`), pulsar `+` una vez (cantidad 2, la tarjeta se reinicia) y agregar otra vez; volver a `Carrito`.
    await page.getByRole('link', { name: 'Inicio' }).click();
    await expect(page).toHaveURL(/\/home$/);
    await expect(cantidad).toHaveValue('1');
    await botonMas.click();
    await expect(cantidad).toHaveValue('2');
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);

    // COMPORTAMIENTO OBSERVADO (H2): el juego ya presente no se actualiza al re-agregarlo; el Total sigue en $540000 y no hay aviso.
    test.info().annotations.push({
      type: 'observación',
      description:
        'H2: re-agregar un videojuego ya presente en el carrito con otra cantidad no lo actualiza (conserva la cantidad inicial 3) y no avisa al usuario.',
    });
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toHaveCount(1);
    await expect(resumenVideojuegos).toHaveText(/^Videojuegos\s*1$/);
    await expect(resumenTotal).toHaveText(/^Total\s*\$540000$/);
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
  });
});
