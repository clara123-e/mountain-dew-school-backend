
import sequelize from '../config/database.js'
import User from './User.js'
import Course from './Course.js'
import SchoolClass from './SchoolClass.js'
import Order from './Order.js'
import Inquiry from './Inquiry.js'
import InquiryThread from './InquiryThread.js'
import Wishlist from './Wishlist.js'
import Payment from './Payment.js'
import Promo from './Promo.js'
import Refund from './Refund.js'

// Every association names its foreignKey to avoid duplicate columns.

// A user raises many inquiries
User.hasMany(Inquiry, { foreignKey: 'userId' })
Inquiry.belongsTo(User, { foreignKey: 'userId' })

// An inquiry has many thread replies
Inquiry.hasMany(InquiryThread, { foreignKey: 'inquiry_id' })
InquiryThread.belongsTo(Inquiry, { foreignKey: 'inquiry_id' })

// A user writes many thread replies
User.hasMany(InquiryThread, { foreignKey: 'userId' })
InquiryThread.belongsTo(User, { foreignKey: 'userId' })

// A user has many orders
User.hasMany(Order, { foreignKey: 'userId' })
Order.belongsTo(User, { foreignKey: 'userId' })

// An order has many payments and refunds
Order.hasMany(Payment, { foreignKey: 'orderId' })
Payment.belongsTo(Order, { foreignKey: 'orderId' })

Order.hasMany(Refund, { foreignKey: 'orderId' })
Refund.belongsTo(Order, { foreignKey: 'orderId' })

// The staff member who processed a refund
Refund.belongsTo(User, {
  foreignKey: 'processedBy',
  as: 'processor',
})

// Users and courses are connected through Wishlist
User.belongsToMany(Course, {
  through: Wishlist,
  foreignKey: 'userId',
  otherKey: 'courseId',
})

Course.belongsToMany(User, {
  through: Wishlist,
  foreignKey: 'courseId',
  otherKey: 'userId',
})

Wishlist.belongsTo(User, { foreignKey: 'userId' })
Wishlist.belongsTo(Course, { foreignKey: 'courseId' })

User.hasMany(Wishlist, { foreignKey: 'userId' })
Course.hasMany(Wishlist, { foreignKey: 'courseId' })

// Export all models, including SchoolClass
export {
  sequelize,
  User,
  Course,
  SchoolClass,
  Order,
  Inquiry,
  InquiryThread,
  Wishlist,
  Payment,
  Promo,
  Refund,
}
