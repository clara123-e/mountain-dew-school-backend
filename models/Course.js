import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Course = sequelize.define(
  'Course',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: true } },
    description: { type: DataTypes.TEXT },
    teacherName: { type: DataTypes.STRING(100) },
    schedule: { type: DataTypes.STRING(100) },
  },
  { timestamps: true, paranoid: true }
)

export default Course