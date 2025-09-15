import { DataTypes } from 'sequelize';
import db from '../config/Database.js'; 
import Paciente from './PacienteModel.js';

const MetricasSalud = db.define('metricas_salud', {
  weight: DataTypes.FLOAT,
  fatPercentage: DataTypes.FLOAT,
  muscleKg: DataTypes.FLOAT,
  bodyWater: DataTypes.FLOAT,
  phy: DataTypes.INTEGER,
  muscle: DataTypes.FLOAT,
  metabolicAge: DataTypes.INTEGER,
  heartRate: DataTypes.INTEGER,
  boneKg: DataTypes.FLOAT,
  visceralFat: DataTypes.FLOAT,
  bmi: DataTypes.FLOAT,
  hip: DataTypes.FLOAT,
  arms: DataTypes.FLOAT,
  thighs: DataTypes.FLOAT,
  calves: DataTypes.FLOAT,
  chest: DataTypes.FLOAT,
  waist: DataTypes.FLOAT,
  abdomen: DataTypes.FLOAT,
  kcla: DataTypes.FLOAT,

  pacienteUuid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'paciente', 
      key: 'uuid'
    }
  }
}, {
  freezeTableName: true,
  timestamps: true
});


MetricasSalud.belongsTo(Paciente, { foreignKey: 'pacienteUuid', as: 'paciente' });
Paciente.hasMany(MetricasSalud, { foreignKey: 'pacienteUuid', as: 'metricas' });

export default MetricasSalud;
