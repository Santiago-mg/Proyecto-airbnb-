import dotenv from 'dotenv';

import {
  db, Usuario, Categoria, Propiedad, Reserva, Resena, Anuncio,
} from '../models/index.js';

dotenv.config();

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1280&q=80`;

const CATEGORIAS = [
  { nombre: 'Apartamento', icono: 'building' },
  { nombre: 'Casa', icono: 'home' },
  { nombre: 'Cabana', icono: 'tree' },
  { nombre: 'Villa de lujo', icono: 'sparkles' },
  { nombre: 'Loft', icono: 'layers' },
  { nombre: 'Frente al mar', icono: 'waves' },
  { nombre: 'Finca', icono: 'tractor' },
  { nombre: 'Ecolodge', icono: 'leaf' },
];

const SERVICIOS_BASE = ['Wi-Fi', 'Cocina', 'Parqueadero', 'Aire acondicionado', 'TV', 'Lavadora'];
const SERVICIOS_LUJO = [...SERVICIOS_BASE, 'Piscina', 'Jacuzzi'];
const SERVICIOS_RURAL = ['Wi-Fi', 'Cocina', 'Desayuno', 'Mascotas'];

const TODAS_PROPIEDADES = [
  // --- MEDELLÍN ---
  {
    titulo: 'Apartamento moderno con vista al skyline',
    descripcion: 'Espacio luminoso y contemporaneo en el corazon de la ciudad, ideal para viajes de trabajo o escapadas urbanas. Cuenta con todas las comodidades y excelente ubicacion a pasos del metro y los mejores restaurantes del Poblado.',
    ciudad: 'Medellin', precioNoche: 320000, huespedes: 4, habitaciones: 2, camas: 2, banos: 2,
    categoria: 'Apartamento', destacada: true, servicios: SERVICIOS_BASE,
    imagenes: [img('1502672260266-1c1ef2d93688'), img('1493809842364-78817add7ffb'), img('1522708323590-d24dbb6b0267')],
    anfitrion: 'mateo',
  },
  {
    titulo: 'Penthouse de lujo con terraza panoramica',
    descripcion: 'Penthouse exclusivo en el Poblado con terraza privada, jacuzzi exterior y vista de 360 grados sobre la ciudad. Acabados de alta gama y domotica completa. Experiencia cinco estrellas garantizada.',
    ciudad: 'Medellin', precioNoche: 890000, huespedes: 6, habitaciones: 3, camas: 3, banos: 3,
    categoria: 'Villa de lujo', destacada: true, servicios: SERVICIOS_LUJO,
    imagenes: [img('1567496898669-ee935f5f647a'), img('1560448204-e02f11c3d0e2'), img('1560185007-cde436f6a4d0')],
    anfitrion: 'mateo',
  },
  {
    titulo: 'Loft industrial en Laureles',
    descripcion: 'Loft de techos altos con diseno industrial, paredes de ladrillo y mobiliario de autor en el barrio Laureles. A pasos de los mejores cafes, ciclovias y vida nocturna de Medellin.',
    ciudad: 'Medellin', precioNoche: 220000, huespedes: 2, habitaciones: 1, camas: 1, banos: 1,
    categoria: 'Loft', destacada: false, servicios: SERVICIOS_BASE,
    imagenes: [img('1536376072261-38c75010e6c9'), img('1554995207-c18c203602cb'), img('1484154218962-a197022b5858')],
    anfitrion: 'mateo',
  },
  // --- CARTAGENA ---
  {
    titulo: 'Villa frente al mar con piscina infinita',
    descripcion: 'Lujo absoluto frente al oceano en Boca Grande. Piscina infinita con vista al mar, chef privado disponible y atardeceres inolvidables. La experiencia premium definitiva en el Caribe colombiano.',
    ciudad: 'Cartagena', precioNoche: 1250000, huespedes: 10, habitaciones: 5, camas: 6, banos: 5,
    categoria: 'Frente al mar', destacada: true, servicios: SERVICIOS_LUJO,
    imagenes: [img('1512917774080-9991f1c4c750'), img('1613490493576-7fde63acd811'), img('1582268611958-ebfd161ef9cf')],
    anfitrion: 'valentina',
  },
  {
    titulo: 'Casa colonial en la Ciudad Amurallada',
    descripcion: 'Joya arquitectonica dentro de las murallas de Cartagena. Patio interior con fuente, habitaciones decoradas con arte local y terrazas con vista a los campanarios coloniales. Ubicacion inmejorable.',
    ciudad: 'Cartagena', precioNoche: 680000, huespedes: 6, habitaciones: 3, camas: 4, banos: 2,
    categoria: 'Casa', destacada: true, servicios: SERVICIOS_BASE,
    imagenes: [img('1564013799919-ab600027ffc6'), img('1572120360610-d971b9d7767c'), img('1583608205776-bfd35f0d9f83')],
    anfitrion: 'valentina',
  },
  {
    titulo: 'Apartamento boutique en Getsemani',
    descripcion: 'Apartamento de diseno en el vibrante barrio de Getsemani, corazon cultural de Cartagena. Murales callejeros, buena gastronomia y ambiente bohemio a pasos de la puerta.',
    ciudad: 'Cartagena', precioNoche: 380000, huespedes: 3, habitaciones: 2, camas: 2, banos: 1,
    categoria: 'Apartamento', destacada: false, servicios: SERVICIOS_BASE,
    imagenes: [img('1502005229762-cf1b2da7c5d6'), img('1505691723518-36a5ac3be353'), img('1522771739844-6a9f6d5f14af')],
    anfitrion: 'mateo',
  },
  // --- SANTA MARTA ---
  {
    titulo: 'Bungalow tropical frente a la playa',
    descripcion: 'Despierta con el sonido de las olas en este bungalow a pie de playa en El Rodadero. Hamacas, palmeras y acceso directo al mar Caribe colombiano.',
    ciudad: 'Santa Marta', precioNoche: 540000, huespedes: 4, habitaciones: 2, camas: 3, banos: 2,
    categoria: 'Frente al mar', destacada: true, servicios: SERVICIOS_BASE,
    imagenes: [img('1520250497591-112f2f40a3f4'), img('1540541338287-41700207dee6'), img('1499793983690-e29da59ef1c2')],
    anfitrion: 'mateo',
  },
  {
    titulo: 'Finca ecologica cerca al Parque Tayrona',
    descripcion: 'Finca sostenible rodeada de selva tropical a 20 minutos del Parque Tayrona. Desayuno incluido con productos organicos de la finca, senderos privados y piscina natural.',
    ciudad: 'Santa Marta', precioNoche: 420000, huespedes: 8, habitaciones: 4, camas: 5, banos: 3,
    categoria: 'Finca', destacada: false, servicios: SERVICIOS_RURAL,
    imagenes: [img('1449158743715-0a90ebb6d2d8'), img('1518780664697-55e3ad937233'), img('1505691938895-1758d7feb511')],
    anfitrion: 'valentina',
  },
  // --- BOGOTÁ ---
  {
    titulo: 'Apartamento ejecutivo en Zona Rosa',
    descripcion: 'Moderno apartamento ejecutivo en el corazon de la Zona Rosa bogotana. A pasos de los mejores restaurantes, bares y centros comerciales. Perfecto para viajes de negocios y turismo urbano.',
    ciudad: 'Bogota', precioNoche: 290000, huespedes: 3, habitaciones: 2, camas: 2, banos: 1,
    categoria: 'Apartamento', destacada: false, servicios: SERVICIOS_BASE,
    imagenes: [img('1493809842364-78817add7ffb'), img('1502672260266-1c1ef2d93688'), img('1522708323590-d24dbb6b0267')],
    anfitrion: 'mateo',
  },
  {
    titulo: 'Casa colonial en Usaquen',
    descripcion: 'Hermosa casa colonial en el barrio de Usaquen, uno de los mas pintorescos de Bogota. Chimenea, jardin privado y a pasos del mercado de pulgas del domingo y la plaza principal.',
    ciudad: 'Bogota', precioNoche: 460000, huespedes: 6, habitaciones: 3, camas: 4, banos: 2,
    categoria: 'Casa', destacada: true, servicios: SERVICIOS_BASE,
    imagenes: [img('1564013799919-ab600027ffc6'), img('1583608205776-bfd35f0d9f83'), img('1572120360610-d971b9d7767c')],
    anfitrion: 'valentina',
  },
  {
    titulo: 'Loft de diseno en La Candelaria',
    descripcion: 'Loft artistico en el centro historico de Bogota, rodeado de museos, grafiti y arquitectura colonial. Perfecto para exploradores culturales que quieren vivir la ciudad desde adentro.',
    ciudad: 'Bogota', precioNoche: 180000, huespedes: 2, habitaciones: 1, camas: 1, banos: 1,
    categoria: 'Loft', destacada: false, servicios: SERVICIOS_BASE,
    imagenes: [img('1536376072261-38c75010e6c9'), img('1554995207-c18c203602cb')],
    anfitrion: 'mateo',
  },
  // --- CALI ---
  {
    titulo: 'Apartamento moderno en San Antonio',
    descripcion: 'Hermoso apartamento en el barrio San Antonio, el mas bohemio de Cali. Balcon con vista a la ciudad, cerca a restaurantes, teatros y la vibrante vida cultural salsera de la capital vallecaucana.',
    ciudad: 'Cali', precioNoche: 240000, huespedes: 4, habitaciones: 2, camas: 2, banos: 1,
    categoria: 'Apartamento', destacada: false, servicios: SERVICIOS_BASE,
    imagenes: [img('1502005229762-cf1b2da7c5d6'), img('1522771739844-6a9f6d5f14af')],
    anfitrion: 'valentina',
  },
  // --- GUATAPÉ ---
  {
    titulo: 'Cabana de montana entre arboles',
    descripcion: 'Refugio de madera rodeado de naturaleza en las afueras de Guatape, perfecto para desconectarse. Chimenea, jacuzzi y senderos privados para los amantes del aire libre y el embalse.',
    ciudad: 'Guatape', precioNoche: 410000, huespedes: 6, habitaciones: 3, camas: 4, banos: 2,
    categoria: 'Cabana', destacada: true, servicios: SERVICIOS_LUJO,
    imagenes: [img('1449158743715-0a90ebb6d2d8'), img('1518780664697-55e3ad937233'), img('1505691938895-1758d7feb511')],
    anfitrion: 'valentina',
  },
  {
    titulo: 'Finca con vista directa al embalse de Guatape',
    descripcion: 'Finca familiar con vista panoramica al embalse desde todas las habitaciones. Kayaks disponibles, muelle privado, zona de BBQ y desayuno incluido con arepas y bandeja paisa.',
    ciudad: 'Guatape', precioNoche: 580000, huespedes: 10, habitaciones: 4, camas: 6, banos: 3,
    categoria: 'Finca', destacada: true, servicios: SERVICIOS_RURAL,
    imagenes: [img('1583608205776-bfd35f0d9f83'), img('1564013799919-ab600027ffc6'), img('1572120360610-d971b9d7767c')],
    anfitrion: 'valentina',
  },
  // --- VILLA DE LEYVA ---
  {
    titulo: 'Casa colonial en Villa de Leyva',
    descripcion: 'Autentica casa colonial con patio central y fuente en el pueblo mas bonito de Colombia. Chimenea, paredes de tapia y vistas al imponente valle de la pre-cordillera boyacense.',
    ciudad: 'Villa de Leyva', precioNoche: 360000, huespedes: 8, habitaciones: 4, camas: 5, banos: 3,
    categoria: 'Casa', destacada: false, servicios: SERVICIOS_BASE,
    imagenes: [img('1564013799919-ab600027ffc6'), img('1572120360610-d971b9d7767c'), img('1583608205776-bfd35f0d9f83')],
    anfitrion: 'valentina',
  },
  // --- SALENTO ---
  {
    titulo: 'Finca cafetera en el Eje Cafetero',
    descripcion: 'Finca cafetera autentica en el Quindio donde podras participar del proceso de cosecha y degustacion del mejor cafe de Colombia. Rodeada de guaduales y palmas de cera, con desayuno campesino incluido.',
    ciudad: 'Salento', precioNoche: 320000, huespedes: 6, habitaciones: 3, camas: 4, banos: 2,
    categoria: 'Finca', destacada: true, servicios: SERVICIOS_RURAL,
    imagenes: [img('1449158743715-0a90ebb6d2d8'), img('1518780664697-55e3ad937233')],
    anfitrion: 'valentina',
  },
  // --- SAN ANDRÉS ---
  {
    titulo: 'Cabaña frente al mar de los Siete Colores',
    descripcion: 'Cabaña exclusiva en San Andres isla, con acceso directo al cristalino mar de los Siete Colores. Equipo de snorkel incluido, hamacas en la orilla y atardeceres caribeños desde la terraza privada.',
    ciudad: 'San Andres', precioNoche: 720000, huespedes: 4, habitaciones: 2, camas: 2, banos: 2,
    categoria: 'Frente al mar', destacada: true, servicios: SERVICIOS_BASE,
    imagenes: [img('1520250497591-112f2f40a3f4'), img('1540541338287-41700207dee6')],
    anfitrion: 'mateo',
  },
  // --- BARICHARA ---
  {
    titulo: 'Casa de piedra en Barichara',
    descripcion: 'Encantadora casa construida en piedra arenisca, material tipico del pueblo mas lindo de Colombia. Vista al canon del Chicamocha, patio con hamacas y ambiente colonial perfecto para descansar.',
    ciudad: 'Barichara', precioNoche: 290000, huespedes: 4, habitaciones: 2, camas: 3, banos: 1,
    categoria: 'Casa', destacada: false, servicios: SERVICIOS_RURAL,
    imagenes: [img('1564013799919-ab600027ffc6'), img('1583608205776-bfd35f0d9f83')],
    anfitrion: 'valentina',
  },
  // --- LETICIA ---
  {
    titulo: 'Ecolodge en la selva amazonica',
    descripcion: 'Unica experiencia de hospedaje en plena selva amazonica colombiana. Cabanas elevadas sobre el rio, excursiones guiadas a comunidades indigenas, avistamiento de delfines rosados y naturaleza virgen.',
    ciudad: 'Leticia', precioNoche: 450000, huespedes: 4, habitaciones: 2, camas: 2, banos: 2,
    categoria: 'Ecolodge', destacada: true, servicios: SERVICIOS_RURAL,
    imagenes: [img('1449158743715-0a90ebb6d2d8'), img('1505691938895-1758d7feb511')],
    anfitrion: 'mateo',
  },
  // --- BUCARAMANGA ---
  {
    titulo: 'Apartamento con vista al Canon del Chicamocha',
    descripcion: 'Moderno apartamento en Bucaramanga con terraza y vista privilegiada al impresionante Canon del Chicamocha. Ciudad conocida como la Ciudad Bonita, con excelente clima durante todo el ano.',
    ciudad: 'Bucaramanga', precioNoche: 210000, huespedes: 3, habitaciones: 2, camas: 2, banos: 1,
    categoria: 'Apartamento', destacada: false, servicios: SERVICIOS_BASE,
    imagenes: [img('1567496898669-ee935f5f647a'), img('1560448204-e02f11c3d0e2')],
    anfitrion: 'mateo',
  },
  // --- PEREIRA ---
  {
    titulo: 'Apartaestudio acogedor para dos',
    descripcion: 'Estudio funcional y luminoso en Pereira, ideal para parejas o viajeros solos. Cocina equipada y excelente conexion a internet para nomadas digitales. Puerta de entrada al Eje Cafetero.',
    ciudad: 'Pereira', precioNoche: 160000, huespedes: 2, habitaciones: 1, camas: 1, banos: 1,
    categoria: 'Apartamento', destacada: false, servicios: SERVICIOS_BASE,
    imagenes: [img('1502005229762-cf1b2da7c5d6'), img('1505691723518-36a5ac3be353')],
    anfitrion: 'valentina',
  },
  // Pendiente de aprobacion
  {
    titulo: 'Casa nueva pendiente de revision',
    descripcion: 'Propiedad recien publicada que espera aprobacion del equipo de moderacion en Pereira.',
    ciudad: 'Pereira', precioNoche: 250000, huespedes: 5, habitaciones: 3, camas: 3, banos: 2,
    categoria: 'Casa', destacada: false, servicios: SERVICIOS_BASE,
    imagenes: [img('1570129477492-45c003edd2be')],
    anfitrion: 'mateo',
    estado: 'pendiente',
  },
];

const ejecutarSeed = async () => {
  // Obtener o crear usuarios
  let anfitrion1 = await Usuario.findOne({ where: { email: 'valentina@estadiapro.com' } });
  let anfitrion2 = await Usuario.findOne({ where: { email: 'mateo@estadiapro.com' } });
  let viajero = await Usuario.findOne({ where: { email: 'camila@estadiapro.com' } });

  const necesitaUsuarios = !anfitrion1 || !anfitrion2 || !viajero;

  if (necesitaUsuarios) {
    // eslint-disable-next-line no-console
    console.log('Sembrando usuarios base...');

    await Usuario.findOrCreate({
      where: { email: 'admin@estadiapro.com' },
      defaults: {
        nombre: 'Administrador EstadiaPro', password: 'admin123',
        rol: 'admin', confirmado: true, verificado: true,
      },
    });

    [anfitrion1] = await Usuario.findOrCreate({
      where: { email: 'valentina@estadiapro.com' },
      defaults: {
        nombre: 'Valentina Ruiz', password: 'anfitrion123', rol: 'anfitrion',
        confirmado: true, verificado: true,
        bio: 'Superanfitriona apasionada por los espacios acogedores en la costa.',
        avatar: 'https://i.pravatar.cc/150?img=47',
      },
    });

    [anfitrion2] = await Usuario.findOrCreate({
      where: { email: 'mateo@estadiapro.com' },
      defaults: {
        nombre: 'Mateo Herrera', password: 'anfitrion123', rol: 'anfitrion',
        confirmado: true, verificado: true,
        bio: 'Arquitecto que renta propiedades de diseno en la ciudad.',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
    });

    [viajero] = await Usuario.findOrCreate({
      where: { email: 'camila@estadiapro.com' },
      defaults: {
        nombre: 'Camila Torres', password: 'viajero123', rol: 'viajero',
        confirmado: true, avatar: 'https://i.pravatar.cc/150?img=32',
      },
    });
  }

  // Categorias (idempotente)
  for (const cat of CATEGORIAS) {
    // eslint-disable-next-line no-await-in-loop
    await Categoria.findOrCreate({ where: { nombre: cat.nombre }, defaults: cat });
  }
  const categorias = await Categoria.findAll();
  const catId = (nombre) => {
    const cat = categorias.find((c) => c.nombre === nombre);
    return cat ? cat.id : null;
  };

  const anfitrionPorSlug = { valentina: anfitrion1, mateo: anfitrion2 };

  // Propiedades (solo inserta las que no existen por titulo)
  let nuevas = 0;
  for (const data of TODAS_PROPIEDADES) {
    // eslint-disable-next-line no-await-in-loop
    const existe = await Propiedad.findOne({ where: { titulo: data.titulo } });
    if (!existe) {
      const anfitrion = anfitrionPorSlug[data.anfitrion];
      if (!anfitrion) continue;
      // eslint-disable-next-line no-await-in-loop
      await Propiedad.create({
        titulo: data.titulo,
        descripcion: data.descripcion,
        ciudad: data.ciudad,
        pais: data.pais || 'Colombia',
        precioNoche: data.precioNoche,
        huespedes: data.huespedes,
        habitaciones: data.habitaciones,
        camas: data.camas,
        banos: data.banos,
        categoriaId: catId(data.categoria),
        anfitrionId: anfitrion.id,
        servicios: data.servicios,
        imagenes: data.imagenes,
        estado: data.estado || 'aprobada',
        destacada: data.destacada || false,
        activa: true,
        vistas: Math.floor(Math.random() * 400) + 50,
      });
      nuevas += 1;
    }
  }

  // Reservas y resenas de ejemplo (solo si el viajero no tiene reservas)
  const reservasExistentes = await Reserva.count({ where: { viajeroId: viajero.id } });
  if (reservasExistentes === 0) {
    const propiedades = await Propiedad.findAll({ where: { estado: 'aprobada' }, limit: 3 });

    if (propiedades[0]) {
      await Reserva.create({
        propiedadId: propiedades[0].id, viajeroId: viajero.id,
        fechaInicio: '2026-05-10', fechaFin: '2026-05-14', huespedes: 2, noches: 4,
        total: 4 * Number(propiedades[0].precioNoche), estado: 'completada',
      });
    }

    if (propiedades[2]) {
      await Reserva.create({
        propiedadId: propiedades[2].id, viajeroId: viajero.id,
        fechaInicio: '2026-07-01', fechaFin: '2026-07-05', huespedes: 6, noches: 4,
        total: 4 * Number(propiedades[2].precioNoche), estado: 'confirmada',
      });
    }

    if (propiedades[0]) {
      await Resena.findOrCreate({
        where: { propiedadId: propiedades[0].id, autorId: viajero.id },
        defaults: { calificacion: 5, comentario: 'Increible ubicacion y muy limpio. El anfitrion fue super atento.' },
      });
    }
    if (propiedades[1]) {
      await Resena.findOrCreate({
        where: { propiedadId: propiedades[1].id, autorId: viajero.id },
        defaults: { calificacion: 5, comentario: 'La propiedad es un sueno, ideal para descansar rodeado de naturaleza.' },
      });
    }
  }

  // Anuncio global (solo si no hay ninguno)
  const anuncioExiste = await Anuncio.count();
  if (!anuncioExiste) {
    await Anuncio.create({
      titulo: 'Bienvenido a EstadiaPro',
      mensaje: 'Disfruta un 10% de descuento en tu primera reserva usando el codigo BIENVENIDA10.',
      tipo: 'promo',
      activo: true,
    });
  }

  if (nuevas > 0 || necesitaUsuarios) {
    // eslint-disable-next-line no-console
    console.log(`Seed completado. ${nuevas} propiedades nuevas insertadas.`);
    // eslint-disable-next-line no-console
    console.log('Admin: admin@estadiapro.com / admin123');
  }

  return true;
};

// Permite ejecutar `npm run seed` de forma independiente.
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    await db.authenticate();
    await db.sync({ alter: true });
    await ejecutarSeed();
    await db.close();
  })();
}

export { ejecutarSeed };
