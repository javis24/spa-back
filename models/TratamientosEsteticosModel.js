// models/TratamientosEsteticos.js
import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import Paciente from './PacienteModel.js';

const TratamientosEsteticos = db.define('tratamientos_esteticos', {
  pacienteUuid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'paciente', // nombre de tabla
      key: 'uuid',
    },
  },
  cavitation: { type: DataTypes.INTEGER, defaultValue: 0 },
  radioFrequency: { type: DataTypes.INTEGER, defaultValue: 0 },
  lipoLaser: { type: DataTypes.INTEGER, defaultValue: 0 },
  vacuum: { type: DataTypes.INTEGER, defaultValue: 0 },
  gluteCups: { type: DataTypes.INTEGER, defaultValue: 0 },
  woodTherapy: { type: DataTypes.INTEGER, defaultValue: 0 },
  lymphaticDrainage: { type: DataTypes.INTEGER, defaultValue: 0 },
  detox: { type: DataTypes.INTEGER, defaultValue: 0 },
  mesotherapy: { type: DataTypes.INTEGER, defaultValue: 0 },
  passiveGym: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  freezeTableName: true,
  timestamps: true,
});


TratamientosEsteticos.belongsTo(Paciente, {
  foreignKey: 'pacienteUuid',
  as: 'paciente'
});
Paciente.hasMany(TratamientosEsteticos, {
  foreignKey: 'pacienteUuid',
  as: 'tratamientos'
});

export default TratamientosEsteticos;
