import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Payment = sequelize.define(
  'Payment',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    method: {
      type: DataTypes.ENUM('card', 'mobile-money', 'bank-transfer', 'cash'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    transactionRef: { type: DataTypes.STRING, unique: true },
    paidAt: { type: DataTypes.DATE, allowNull: true },
  },
  { timestamps: true, paranoid: true }
)

export default Payment