import db from '../config/db.js';
import Usuario from './Usuario.js';
import Categoria from './Categoria.js';
import Propiedad from './Propiedad.js';
import Reserva from './Reserva.js';
import Resena from './Resena.js';
import Favorito from './Favorito.js';
import Anuncio from './Anuncio.js';
import AuditLog from './AuditLog.js';

// Anfitrion (Usuario) <-> Propiedad
Usuario.hasMany(Propiedad, { foreignKey: 'anfitrionId', as: 'propiedades' });
Propiedad.belongsTo(Usuario, { foreignKey: 'anfitrionId', as: 'anfitrion' });

// Categoria <-> Propiedad
Categoria.hasMany(Propiedad, { foreignKey: 'categoriaId', as: 'propiedades' });
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

// Reservas
Propiedad.hasMany(Reserva, { foreignKey: 'propiedadId', as: 'reservas' });
Reserva.belongsTo(Propiedad, { foreignKey: 'propiedadId', as: 'propiedad' });
Usuario.hasMany(Reserva, { foreignKey: 'viajeroId', as: 'reservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'viajeroId', as: 'viajero' });

// Resenas
Propiedad.hasMany(Resena, { foreignKey: 'propiedadId', as: 'resenas' });
Resena.belongsTo(Propiedad, { foreignKey: 'propiedadId', as: 'propiedad' });
Usuario.hasMany(Resena, { foreignKey: 'autorId', as: 'resenas' });
Resena.belongsTo(Usuario, { foreignKey: 'autorId', as: 'autor' });

// Favoritos
Usuario.hasMany(Favorito, { foreignKey: 'usuarioId', as: 'favoritos' });
Favorito.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Propiedad.hasMany(Favorito, { foreignKey: 'propiedadId', as: 'favoritos' });
Favorito.belongsTo(Propiedad, { foreignKey: 'propiedadId', as: 'propiedad' });

export {
  db,
  Usuario,
  Categoria,
  Propiedad,
  Reserva,
  Resena,
  Favorito,
  Anuncio,
  AuditLog,
};
