
import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const SchoolClass = sequelize.define(
  'SchoolClass',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: { notEmpty: true },
    },
    level: {
      type: DataTypes.ENUM(
        'Creche',
        'Nursery',
        'KG',
        'Primary',
        'JHS'
      ),
      allowNull: false,
    },
    yearGroup: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { notEmpty: true },
    },
    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'academicYear'],
      },
    ],
  }
)

export default SchoolClass
