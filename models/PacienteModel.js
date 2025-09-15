// models/Pacientes.js
import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';

const Pacientes = db.define('paciente', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    validate: { notEmpty: true }
  },
  address: DataTypes.STRING,
  phoneNumber: {
    type: DataTypes.STRING,
    validate: { isNumeric: true }
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  evaluationDate: DataTypes.DATE,
  age: {
    type: DataTypes.INTEGER,
    validate: { min: 0 }
  },
  height: {
    type: DataTypes.FLOAT,
    validate: { min: 0 }
  },
  unwantedGain: DataTypes.STRING,
  pathologies: DataTypes.TEXT,
  lastActive: DataTypes.DATE,
  userId: {
    type: DataTypes.INTEGER, 
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true
});


Users.hasMany(Pacientes, { foreignKey: 'userId', as: 'pacientes' });
Pacientes.belongsTo(Users, { foreignKey: 'userId', as: 'usuarioAsignado' });

export default Pacientes;
