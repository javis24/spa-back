// models/Cita.js
import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';

const Cita = db.define('citas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // nombre de tabla
      key: 'id'
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  servicio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: true,
});


Cita.belongsTo(Users, { foreignKey: 'userId', as: 'usuario' });
Users.hasMany(Cita, { foreignKey: 'userId', as: 'citas' });

export default Cita;
