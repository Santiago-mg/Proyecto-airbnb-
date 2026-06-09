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
];

const SERVICIOS_BASE = ['Wi-Fi', 'Cocina', 'Parqueadero', 'Aire acondicionado', 'TV', 'Lavadora'];

// Devuelve true si efectivamente se sembraron datos.
const ejecutarSeed = async () => {
  const existentes = await Usuario.count();
  if (existentes > 0) {
    return false;
  }

  // eslint-disable-next-line no-console
  console.log('Sembrando datos de demostracion...');

  const categorias = await Categoria.bulkCreate(CATEGORIAS);
  const catId = (nombre) => categorias.find((c) => c.nombre === nombre).id;

  const admin = await Usuario.create({
    nombre: 'Administrador EstadiaPro',
    email: 'admin@estadiapro.com',
    password: 'admin123',
    rol: 'admin',
    confirmado: true,
    verificado: true,
  });

  const anfitrion1 = await Usuario.create({
    nombre: 'Valentina Ruiz',
    email: 'valentina@estadiapro.com',
    password: 'anfitrion123',
    rol: 'anfitrion',
    confirmado: true,
    verificado: true,
    bio: 'Superanfitriona apasionada por los espacios acogedores en la costa.',
    avatar: 'https://i.pravatar.cc/150?img=47',
  });

  const anfitrion2 = await Usuario.create({
    nombre: 'Mateo Herrera',
    email: 'mateo@estadiapro.com',
    password: 'anfitrion123',
    rol: 'anfitrion',
    confirmado: true,
    verificado: true,
    bio: 'Arquitecto que renta propiedades de diseno en la ciudad.',
    avatar: 'https://i.pravatar.cc/150?img=12',
  });

  const viajero = await Usuario.create({
    nombre: 'Camila Torres',
    email: 'camila@estadiapro.com',
    password: 'viajero123',
    rol: 'viajero',
    confirmado: true,
    avatar: 'https://i.pravatar.cc/150?img=32',
  });

  const propiedadesData = [
    {
      titulo: 'Apartamento moderno con vista al skyline',
      descripcion: 'Espacio luminoso y contemporaneo en el corazon de la ciudad, ideal para viajes de trabajo o escapadas urbanas. Cuenta con todas las comodidades y excelente ubicacion.',
      ciudad: 'Medellin', pais: 'Colombia', precioNoche: 320000, huespedes: 4, habitaciones: 2, camas: 2, banos: 2,
      categoriaId: catId('Apartamento'), anfitrionId: anfitrion2.id, destacada: true,
      imagenes: [img('1502672260266-1c1ef2d93688'), img('1493809842364-78817add7ffb'), img('1522708323590-d24dbb6b0267')],
    },
    {
      titulo: 'Cabana de montana entre arboles',
      descripcion: 'Refugio de madera rodeado de naturaleza, perfecto para desconectarse. Chimenea, jacuzzi y senderos privados para los amantes del aire libre.',
      ciudad: 'Guatape', pais: 'Colombia', precioNoche: 410000, huespedes: 6, habitaciones: 3, camas: 4, banos: 2,
      categoriaId: catId('Cabana'), anfitrionId: anfitrion1.id, destacada: true,
      imagenes: [img('1449158743715-0a90ebb6d2d8'), img('1518780664697-55e3ad937233'), img('1505691938895-1758d7feb511')],
    },
    {
      titulo: 'Villa frente al mar con piscina infinita',
      descripcion: 'Lujo absoluto frente al oceano. Piscina infinita, chef privado disponible y atardeceres inolvidables. La experiencia premium definitiva.',
      ciudad: 'Cartagena', pais: 'Colombia', precioNoche: 1250000, huespedes: 10, habitaciones: 5, camas: 6, banos: 5,
      categoriaId: catId('Frente al mar'), anfitrionId: anfitrion1.id, destacada: true,
      imagenes: [img('1512917774080-9991f1c4c750'), img('1613490493576-7fde63acd811'), img('1582268611958-ebfd161ef9cf')],
    },
    {
      titulo: 'Loft industrial en zona historica',
      descripcion: 'Loft de techos altos con diseno industrial, paredes de ladrillo y mobiliario de autor. A pasos de cafes, galerias y vida nocturna.',
      ciudad: 'Bogota', pais: 'Colombia', precioNoche: 280000, huespedes: 2, habitaciones: 1, camas: 1, banos: 1,
      categoriaId: catId('Loft'), anfitrionId: anfitrion2.id,
      imagenes: [img('1536376072261-38c75010e6c9'), img('1554995207-c18c203602cb'), img('1484154218962-a197022b5858')],
    },
    {
      titulo: 'Casa campestre con jardin amplio',
      descripcion: 'Casa familiar con amplio jardin, zona de BBQ y espacios para ninos. Tranquilidad total a solo minutos del centro.',
      ciudad: 'Villa de Leyva', pais: 'Colombia', precioNoche: 360000, huespedes: 8, habitaciones: 4, camas: 5, banos: 3,
      categoriaId: catId('Casa'), anfitrionId: anfitrion1.id,
      imagenes: [img('1564013799919-ab600027ffc6'), img('1572120360610-d971b9d7767c'), img('1583608205776-bfd35f0d9f83')],
    },
    {
      titulo: 'Penthouse de lujo con terraza panoramica',
      descripcion: 'Penthouse exclusivo con terraza privada, jacuzzi exterior y vista de 360 grados. Acabados de alta gama y domotica completa.',
      ciudad: 'Medellin', pais: 'Colombia', precioNoche: 890000, huespedes: 6, habitaciones: 3, camas: 3, banos: 3,
      categoriaId: catId('Villa de lujo'), anfitrionId: anfitrion2.id, destacada: true,
      imagenes: [img('1567496898669-ee935f5f647a'), img('1560448204-e02f11c3d0e2'), img('1560185007-cde436f6a4d0')],
    },
    {
      titulo: 'Apartaestudio acogedor para dos',
      descripcion: 'Estudio funcional y luminoso, ideal para parejas o viajeros solos. Cocina equipada y excelente conexion a internet para nomadas digitales.',
      ciudad: 'Cali', pais: 'Colombia', precioNoche: 180000, huespedes: 2, habitaciones: 1, camas: 1, banos: 1,
      categoriaId: catId('Apartamento'), anfitrionId: anfitrion1.id,
      imagenes: [img('1502005229762-cf1b2da7c5d6'), img('1505691723518-36a5ac3be353'), img('1522771739844-6a9f6d5f14af')],
    },
    {
      titulo: 'Bungalow tropical frente a la playa',
      descripcion: 'Despierta con el sonido de las olas en este bungalow a pie de playa. Hamacas, palmeras y acceso directo al mar caribe.',
      ciudad: 'Santa Marta', pais: 'Colombia', precioNoche: 540000, huespedes: 4, habitaciones: 2, camas: 3, banos: 2,
      categoriaId: catId('Frente al mar'), anfitrionId: anfitrion2.id, destacada: true,
      imagenes: [img('1520250497591-112f2f40a3f4'), img('1540541338287-41700207dee6'), img('1499793983690-e29da59ef1c2')],
    },
  ];

  const propiedades = [];
  for (const data of propiedadesData) {
    // Las propiedades de demostracion entran ya aprobadas para verse en el inicio.
    // eslint-disable-next-line no-await-in-loop
    const propiedad = await Propiedad.create({
      ...data,
      servicios: SERVICIOS_BASE,
      estado: 'aprobada',
      vistas: Math.floor(Math.random() * 400) + 50,
    });
    propiedades.push(propiedad);
  }

  // Una propiedad pendiente de aprobacion para la cola de moderacion del admin.
  await Propiedad.create({
    titulo: 'Casa nueva pendiente de revision',
    descripcion: 'Propiedad recien publicada que espera aprobacion del equipo de moderacion.',
    ciudad: 'Pereira', pais: 'Colombia', precioNoche: 250000, huespedes: 5, habitaciones: 3, camas: 3, banos: 2,
    categoriaId: catId('Casa'), anfitrionId: anfitrion2.id, servicios: SERVICIOS_BASE,
    estado: 'pendiente', imagenes: [img('1570129477492-45c003edd2be')],
  });

  // Reservas y resenas de ejemplo.
  const r1 = await Reserva.create({
    propiedadId: propiedades[0].id, viajeroId: viajero.id,
    fechaInicio: '2026-05-10', fechaFin: '2026-05-14', huespedes: 2, noches: 4,
    total: 4 * Number(propiedades[0].precioNoche), estado: 'completada',
  });

  await Reserva.create({
    propiedadId: propiedades[2].id, viajeroId: viajero.id,
    fechaInicio: '2026-07-01', fechaFin: '2026-07-05', huespedes: 6, noches: 4,
    total: 4 * Number(propiedades[2].precioNoche), estado: 'confirmada',
  });

  await Resena.bulkCreate([
    { propiedadId: propiedades[0].id, autorId: viajero.id, calificacion: 5, comentario: 'Increible ubicacion y muy limpio. El anfitrion fue super atento.' },
    { propiedadId: propiedades[1].id, autorId: viajero.id, calificacion: 5, comentario: 'La cabana es un sueno, ideal para descansar rodeado de naturaleza.' },
    { propiedadId: propiedades[2].id, autorId: viajero.id, calificacion: 4, comentario: 'La villa es espectacular, la piscina infinita vale cada peso.' },
  ]);

  await Anuncio.create({
    titulo: 'Bienvenido a EstadiaPro',
    mensaje: 'Disfruta un 10% de descuento en tu primera reserva usando el codigo BIENVENIDA10.',
    tipo: 'promo',
    activo: true,
  });

  // eslint-disable-next-line no-console
  console.log('Seed completado. Admin: admin@estadiapro.com / admin123');
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
