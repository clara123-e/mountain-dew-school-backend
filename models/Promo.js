import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Promo = sequelize.define(
  'Promo',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
      set(value) {
        this.setDataValue('code', String(value).trim().toUpperCase())
      },
    },
    description: { type: DataTypes.STRING },
    discountType: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: false },
    discountValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    validFrom: { type: DataTypes.DATE, allowNull: false },
    validUntil: { type: DataTypes.DATE, allowNull: false },
    usageLimit: { type: DataTypes.INTEGER, allowNull: true },
    usedCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    timestamps: true,
    paranoid: true,
    validate: {
      validDates() {
        if (this.validUntil < this.validFrom) {
          throw new Error('validUntil must be after validFrom')
        }
      },
    },
  }
)

export default Promo