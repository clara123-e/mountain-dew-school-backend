import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

// Junction table between Users and Courses (super many-to-many).
// For the school context the wishlisted item is a Course, so itemId from the brief is courseId here.
// paranoid is false so removing a course from a wishlist deletes the row and it can be added again later.
const Wishlist = sequelize.define(
  'Wishlist',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    courseId: { type: DataTypes.UUID, allowNull: false },
  },
  {
    timestamps: true,
    paranoid: false,
    indexes: [{ unique: true, fields: ['userId', 'courseId'] }],
  }
)

export default Wishlist