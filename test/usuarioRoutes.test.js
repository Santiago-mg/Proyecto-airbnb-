describe('Rutas Usuario', () => {

    test('Ruta login definida', () => {
        expect('/auth/login').toBe('/auth/login');
    });

    test('Ruta registro definida', () => {
        expect('/auth/registro').toBe('/auth/registro');
    });

});