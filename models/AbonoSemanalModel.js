// models/AbonoSemanalModel.js
import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import User from './UserModel.js';

const AbonoSemanal = db.define('abono_semanal', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 0 }
  },
  fechaAbono: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  semana: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true
});

User.hasMany(AbonoSemanal, { foreignKey: 'userId' });
AbonoSemanal.belongsTo(User, { foreignKey: 'userId' });

export default AbonoSemanal;
