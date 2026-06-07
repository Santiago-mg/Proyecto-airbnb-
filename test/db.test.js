import db from '../config/db.js';

describe('Base de Datos', () => {

    test('La conexión debe existir', () => {
        expect(db).toBeDefined();
    });

});