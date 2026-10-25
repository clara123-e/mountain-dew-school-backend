import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

// In the school context an Order is a fee invoice raised for a parent or student.
const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    description: { type: DataTypes.STRING },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  { timestamps: true, paranoid: true }
)

export default Order