import { crearError } from '../src/helpers/errors.js';

describe('helpers/errors - crearError', () => {
  test('crea un Error con statusCode', () => {
    const error = crearError('No encontrado', 404);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('No encontrado');
    expect(error.statusCode).toBe(404);
  });

  test('statusCode por defecto es 400', () => {
    const error = crearError('Datos invalidos');
    expect(error.statusCode).toBe(400);
  });
});
