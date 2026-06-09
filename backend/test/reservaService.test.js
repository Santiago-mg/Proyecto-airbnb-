import { calcularNoches } from '../src/services/reservaService.js';

describe('services/reservaService - calcularNoches', () => {
  test('calcula correctamente el numero de noches', () => {
    expect(calcularNoches('2026-05-10', '2026-05-14')).toBe(4);
  });

  test('una sola noche', () => {
    expect(calcularNoches('2026-05-10', '2026-05-11')).toBe(1);
  });

  test('rango invalido devuelve cero o negativo', () => {
    expect(calcularNoches('2026-05-14', '2026-05-10')).toBeLessThanOrEqual(0);
  });
});
