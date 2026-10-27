
import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Learner = sequelize.define(
  'Learner',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    admissionNumber: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    firstName: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: { notEmpty: true },
    },
    lastName: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: { notEmpty: true },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    schoolClassId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'SchoolClasses',
        key: 'id',
      },
    },
    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '2026/2027',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'graduated']],
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['lastName', 'firstName'],
      },
    ],
  }
)

export default Learner
