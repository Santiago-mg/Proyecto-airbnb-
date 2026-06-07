import { formularioLogin } from '../controllers/usuarioController.js';

describe('Controlador Usuario', () => {

    test('formularioLogin debe existir', () => {
        expect(formularioLogin).toBeDefined();
    });

});