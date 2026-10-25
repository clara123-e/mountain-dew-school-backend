import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const InquiryThread = sequelize.define(
  'InquiryThread',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    // Points to Inquiry.id (not the public INQ code)
    inquiry_id: { type: DataTypes.UUID, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    sender: { type: DataTypes.ENUM('student', 'admin'), allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
  },
  { timestamps: true, paranoid: true }
)

export default InquiryThread