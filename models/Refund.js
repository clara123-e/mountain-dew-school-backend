import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Refund = sequelize.define(
  'Refund',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    reason: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM('requested', 'approved', 'rejected', 'processed'),
      allowNull: false,
      defaultValue: 'requested',
    },
    date: { type: DataTypes.DATE, allowNull: false },
    processedBy: { type: DataTypes.UUID, allowNull: true },
  },
  { timestamps: true, paranoid: true }
)

export default Refund