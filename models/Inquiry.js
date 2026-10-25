import crypto from 'crypto'
import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Inquiry = sequelize.define(
  'Inquiry',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    // Public reference code such as INQ-2026-004821, created automatically below
    inquiry_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { len: [5, 100] },
    },
    message: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    status: {
      type: DataTypes.ENUM('open', 'in-progress', 'resolved'),
      allowNull: false,
      defaultValue: 'open',
    },
    userId: { type: DataTypes.UUID, allowNull: false },
  },
  {
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeValidate: (inquiry) => {
        if (!inquiry.inquiry_id) {
          const number = String(crypto.randomInt(0, 1000000)).padStart(6, '0')
          inquiry.inquiry_id = `INQ-${new Date().getFullYear()}-${number}`
        }
      },
    },
  }
)

export default Inquiry