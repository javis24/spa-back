import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import User from './UserModel.js';

const RegistroAsistencia = db.define('registro_asistencia', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horaEntrada: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  horaSalida: {
    type: DataTypes.TIME,
    allowNull: true,
  }
}, {
  freezeTableName: true,
  timestamps: true
});

// Relaciones
RegistroAsistencia.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(RegistroAsistencia, { foreignKey: 'userId' });

export default RegistroAsistencia;
