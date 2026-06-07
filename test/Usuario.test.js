import Usuario from '../models/Usuario.js';

describe('Modelo Usuario', () => {

    test('Modelo Usuario debe existir', () => {
        expect(Usuario).toBeDefined();
    });

    test('Debe tener método create', () => {
        expect(typeof Usuario.create).toBe('function');
    });

});