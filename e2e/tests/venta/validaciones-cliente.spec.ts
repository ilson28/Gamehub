// spec: specs/venta.md
// seed: tests/seed.spec.ts
import { test, expect } from '../../fixtures/gamehub';

test.describe('Validaciones del formulario de cliente', () => {
  test('Cédula y teléfono inválidos bloquean la venta', async ({ page, api }) => {
    // 1. Referencias y estado inicial: VAL-01, VAL-02. Videojuego `E2E Validaciones` (stock 10). No consume stock.
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();

    // 2. En `/home` pulsar `Agregar E2E Validaciones al carrito` y navegar a `Carrito`.
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();
    await expect(page.getByText('Total', { exact: true }).locator('..')).toHaveText(/^Total\s*\$180000$/);

    // 3. Llenar Cedula = '123', Telefono = '300', Nombre = 'Cliente', Apellidos = 'E2E', Direccion = 'Cra 51b #79-56'. Pulsar `Finalizar Transaccion`.
    await page.getByLabel('Cedula').fill('123');
    await page.getByLabel('Telefono').fill('300');
    await page.getByLabel('Nombre').fill('Cliente');
    await page.getByLabel('Apellidos').fill('E2E');
    await page.getByLabel('Direccion').fill('Cra 51b #79-56');
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();

    await expect(page.getByText('Debe tener minimo 7 digitos')).toBeVisible();
    await expect(page.getByText('Debe tener 10 digitos')).toBeVisible();
    // No hay mensajes de error en Nombre, Apellidos ni Direccion.
    await expect(page.getByText('El nombre es obligatorio')).toBeHidden();
    await expect(page.getByText('El apellido es obligatorio')).toBeHidden();
    await expect(page.getByText('La direccion es obligatoria')).toBeHidden();
    // El modal no se abre.
    await expect(page.getByRole('button', { name: 'Confirmar transaccion' })).toBeHidden();

    // 4. Verificar el estado tras el intento.
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();
    await expect(page.getByLabel('Cedula')).toHaveValue('123');
    await expect(page.getByLabel('Telefono')).toHaveValue('300');
    await expect(page.getByLabel('Nombre')).toHaveValue('Cliente');
    await expect(page.getByLabel('Apellidos')).toHaveValue('E2E');
    await expect(page.getByLabel('Direccion')).toHaveValue('Cra 51b #79-56');
  });

  test('Formulario vacío muestra todos los mensajes de campo obligatorio', async ({ page, api }) => {
    // 1. Referencias y estado inicial: VAL-01, VAL-02, VAL-03. Agregar `E2E Validaciones` al carrito y abrir `/cart` con el formulario vacío.
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();

    const mensajeCedula = page.getByText('La cedula es obligatoria');
    const mensajeNombre = page.getByText('El nombre es obligatorio');
    const mensajeApellido = page.getByText('El apellido es obligatorio');
    const mensajeDireccion = page.getByText('La direccion es obligatoria');
    const mensajeTelefono = page.getByText('El telefono es obligatorio');

    // 2. Pulsar `Finalizar Transaccion` sin escribir nada.
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    await expect(mensajeCedula).toBeVisible();
    await expect(mensajeNombre).toBeVisible();
    await expect(mensajeApellido).toBeVisible();
    await expect(mensajeDireccion).toBeVisible();
    await expect(mensajeTelefono).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirmar transaccion' })).toBeHidden();
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);

    // 3. Llenar solo Nombre, Apellidos y Direccion y volver a pulsar `Finalizar Transaccion`.
    await page.getByLabel('Nombre').fill('Cliente');
    await page.getByLabel('Apellidos').fill('E2E');
    await page.getByLabel('Direccion').fill('Cra 51b #79-56');
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();

    await expect(mensajeNombre).toBeHidden();
    await expect(mensajeApellido).toBeHidden();
    await expect(mensajeDireccion).toBeHidden();
    await expect(mensajeCedula).toBeVisible();
    await expect(mensajeTelefono).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirmar transaccion' })).toBeHidden();
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
  });

  test('Nombre, apellido y dirección solo con espacios se rechazan', async ({ page, api }) => {
    // 1. Referencias y estado inicial: VAL-03. Videojuego `E2E Validaciones`; carrito con el juego y formulario vacío.
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();

    // 2. Llenar Cedula = '1234567', Telefono = '3001234567' y escribir '   ' (tres espacios) en Nombre, Apellidos y Direccion. Pulsar `Finalizar Transaccion`.
    await page.getByLabel('Cedula').fill('1234567');
    await page.getByLabel('Telefono').fill('3001234567');
    await page.getByLabel('Nombre').fill('   ');
    await page.getByLabel('Apellidos').fill('   ');
    await page.getByLabel('Direccion').fill('   ');
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();

    await expect(page.getByText('El nombre es obligatorio')).toBeVisible();
    await expect(page.getByText('El apellido es obligatorio')).toBeVisible();
    await expect(page.getByText('La direccion es obligatoria')).toBeVisible();
    // No hay mensajes en Cedula ni Telefono.
    await expect(page.getByText('La cedula es obligatoria')).toBeHidden();
    await expect(page.getByText('Debe tener minimo 7 digitos')).toBeHidden();
    await expect(page.getByText('El telefono es obligatorio')).toBeHidden();
    await expect(page.getByText('Debe tener 10 digitos')).toBeHidden();
    // El modal no se abre y el stock no cambia.
    await expect(page.getByRole('button', { name: 'Confirmar transaccion' })).toBeHidden();
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
  });

  test('Límites de la cédula: 6 dígitos falla, 7 dígitos pasa, ceros a la izquierda', async ({ page, api }) => {
    // 1. Referencias y estado inicial: VAL-01. Abrir `/cart` con `E2E Validaciones` agregado; evaluar cada valor en `Cedula` y salir del campo (blur).
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();

    const cedula = page.getByLabel('Cedula');
    const errorMinimo = page.getByText('Debe tener minimo 7 digitos');
    const errorObligatoria = page.getByText('La cedula es obligatoria');

    // 2. Escribir '123456' (6 dígitos) y hacer blur.
    await cedula.fill('123456');
    await cedula.blur();
    await expect(errorMinimo).toBeVisible();

    // 3. Escribir '1234567' (7 dígitos) y hacer blur.
    await cedula.fill('1234567');
    await cedula.blur();
    await expect(errorMinimo).toBeHidden();
    await expect(errorObligatoria).toBeHidden();

    // 4. Escribir '0123456' (7 caracteres con cero inicial) y hacer blur.
    await cedula.fill('0123456');
    await cedula.blur();
    // COMPORTAMIENTO OBSERVADO (H6): el valor se convierte con `Number()` y pierde el cero inicial (queda 123456).
    test.info().annotations.push({
      type: 'observación',
      description:
        'H6: la cédula "0123456" (7 caracteres) falla con "Debe tener minimo 7 digitos" porque Number() elimina el cero inicial.',
    });
    await expect(errorMinimo).toBeVisible();

    // 5. Escribir '01234567' (8 caracteres con cero inicial) y hacer blur.
    await cedula.fill('01234567');
    await cedula.blur();
    // Se evalúa como 1234567 (7 dígitos): no aparece mensaje.
    await expect(errorMinimo).toBeHidden();
    await expect(errorObligatoria).toBeHidden();

    // 6. Vaciar el campo y hacer blur.
    await cedula.fill('');
    await cedula.blur();
    await expect(errorObligatoria).toBeVisible();

    // No se abrió ningún modal ni cambió el stock.
    await expect(page.getByRole('button', { name: 'Confirmar transaccion' })).toBeHidden();
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
  });

  test('Límites del teléfono: 9 y 11 dígitos fallan, 10 pasa', async ({ page, api }) => {
    // 1. Referencias y estado inicial: VAL-02. Abrir `/cart` con `E2E Validaciones` agregado y evaluar `Telefono` con blur tras cada valor.
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();

    const telefono = page.getByLabel('Telefono');
    const errorDiezDigitos = page.getByText('Debe tener 10 digitos');
    const errorObligatorio = page.getByText('El telefono es obligatorio');

    // 2. Escribir '299999999' (9 dígitos) y hacer blur.
    await telefono.fill('299999999');
    await telefono.blur();
    await expect(errorDiezDigitos).toBeVisible();

    // 3. Escribir '3000000000' (10 dígitos) y hacer blur.
    await telefono.fill('3000000000');
    await telefono.blur();
    await expect(errorDiezDigitos).toBeHidden();
    await expect(errorObligatorio).toBeHidden();

    // 4. Escribir '30000000000' (11 dígitos) y hacer blur.
    await telefono.fill('30000000000');
    await telefono.blur();
    await expect(errorDiezDigitos).toBeVisible();

    // 5. Escribir '0300000000' (10 caracteres con cero inicial) y hacer blur.
    await telefono.fill('0300000000');
    await telefono.blur();
    // COMPORTAMIENTO OBSERVADO (H6): `Number()` elimina el cero inicial (quedan 9 dígitos).
    test.info().annotations.push({
      type: 'observación',
      description:
        'H6: el teléfono "0300000000" (10 caracteres) falla con "Debe tener 10 digitos" porque Number() elimina el cero inicial.',
    });
    await expect(errorDiezDigitos).toBeVisible();

    // 6. Vaciar el campo y hacer blur.
    await telefono.fill('');
    await telefono.blur();
    await expect(errorObligatorio).toBeVisible();

    // No se abrió ningún modal ni cambió el stock.
    await expect(page.getByRole('button', { name: 'Confirmar transaccion' })).toBeHidden();
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
  });

  test('Los campos Cedula y Telefono no aceptan letras', async ({ page, api }) => {
    // 1. Referencias y estado inicial: VAL-01, VAL-02. Abrir `/cart` con `E2E Validaciones` agregado. Ambos campos son `<input type=number>`.
    const inicial = await api.getStock('E2E Validaciones');
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();

    const cedula = page.getByLabel('Cedula');
    const telefono = page.getByLabel('Telefono');

    // 2. Teclear con `pressSequentially` 'abc' en `Cedula` y en `Telefono`.
    await cedula.pressSequentially('abc');
    await telefono.pressSequentially('abc');
    await expect(cedula).toHaveValue('');
    await expect(telefono).toHaveValue('');

    // 3. Pulsar `Finalizar Transaccion` con esos campos vacíos.
    await page.getByRole('button', { name: 'Finalizar Transaccion' }).click();
    await expect(page.getByText('La cedula es obligatoria')).toBeVisible();
    await expect(page.getByText('El telefono es obligatorio')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirmar transaccion' })).toBeHidden();
    await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
  });

  // BUG H4 (VAL-01), corregido en form-client.model.js: una cédula negativa (-1234567), decimal (1234567.5) o en
  // notación científica (1e9) pasaba la validación y abría el modal 'Confirmar Transacción'. Ahora se rechaza.
  test(
    'Cédula negativa, decimal o en notación científica no debería aceptarse',
    async ({ page, api }) => {
      // 1. Referencias y estado inicial: VAL-01 (H4). Carrito con `E2E Validaciones` y Nombre, Apellidos, Direccion y Telefono válidos. NO confirmar la venta en ningún paso.
      const inicial = await api.getStock('E2E Validaciones');
      await page.goto('/home');
      await expect(page.getByRole('heading', { name: 'Gestión de Videojuegos' })).toBeVisible();
      await page.getByRole('button', { name: 'Agregar E2E Validaciones al carrito' }).click();
      await page.getByRole('link', { name: 'Carrito' }).click();
      await expect(page).toHaveURL(/\/cart$/);
      await expect(page.getByRole('heading', { name: 'E2E Validaciones' })).toBeVisible();

      await page.getByLabel('Nombre').fill('Cliente');
      await page.getByLabel('Apellidos').fill('E2E');
      await page.getByLabel('Direccion').fill('Cra 51b #79-56');
      await page.getByLabel('Telefono').fill('3001234567');

      const cedula = page.getByLabel('Cedula');
      const finalizar = page.getByRole('button', { name: 'Finalizar Transaccion' });
      const confirmar = page.getByRole('button', { name: 'Confirmar transaccion' });
      const cancelar = page.getByRole('button', { name: 'Cancelar' });
      // Mensaje de validación (esperado) bajo el formulario del cliente.
      const mensajeValidacion = page.getByText(/Debe tener|obligatori|inv[aá]lid/i).first();

      // Se cancela siempre el modal si llegara a abrirse: jamás se confirma una venta.
      const cancelarSiAbierto = async () => {
        if (await confirmar.isVisible()) await cancelar.click();
      };

      // 2, 3 y 4. Escribir cada cédula inválida y pulsar `Finalizar Transaccion`.
      for (const valor of ['-1234567', '1234567.5', '1e9']) {
        await cedula.fill(valor);
        await finalizar.click();
        try {
          // Esperado: mensaje de error y modal cerrado. OBSERVADO (H4): sin error y el modal se abre.
          await expect(mensajeValidacion, `La cédula ${valor} debería rechazarse con un mensaje`).toBeVisible();
          await expect(confirmar, `La cédula ${valor} no debería abrir el modal`).toBeHidden();
        } finally {
          await cancelarSiAbierto();
        }
      }

      await expect.poll(() => api.getStock('E2E Validaciones')).toBe(inicial);
    },
  );
});
