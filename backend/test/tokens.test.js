import { jest } from '@jest/globals';

import { generarId, generarJWT, verificarJWT } from '../src/helpers/tokens.js';

describe('helpers/tokens', () => {
  test('generarId crea identificadores unicos', () => {
    const a = generarId();
    const b = generarId();
    expect(typeof a).toBe('string');
    expect(a).not.toBe(b);
  });

  test('generarJWT y verificarJWT hacen round-trip del payload', () => {
    process.env.JWT_SECRET = 'secreto-de-prueba';
    const token = generarJWT({ id: 99, rol: 'admin' });
    const decoded = verificarJWT(token);
    expect(decoded.id).toBe(99);
    expect(decoded.rol).toBe('admin');
  });

  test('verificarJWT lanza error con token invalido', () => {
    process.env.JWT_SECRET = 'secreto-de-prueba';
    expect(() => verificarJWT('token-falso')).toThrow();
  });
});
