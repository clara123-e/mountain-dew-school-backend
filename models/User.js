import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING(60), allowNull: false, validate: { notEmpty: true } },
    lastName: { type: DataTypes.STRING(60), allowNull: false, validate: { notEmpty: true } },
    username: { type: DataTypes.STRING(40), allowNull: false, unique: true, validate: { len: [3, 40] } },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue('email', String(value).trim().toLowerCase())
      },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('student', 'parent', 'teacher', 'admin'),
      allowNull: false,
      defaultValue: 'student',
    },
  },
  { timestamps: true, paranoid: true }
)

export default User