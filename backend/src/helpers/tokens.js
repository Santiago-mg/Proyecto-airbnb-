const generarId = () => Date.now().toString(32) + Math.random().toString(32).slice(2);

export { generarId };
