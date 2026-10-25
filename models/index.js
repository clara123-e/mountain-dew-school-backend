import sequelize from '../config/database.js'
import User from './User.js'
import Course from './Course.js'
import Order from './Order.js'
import Inquiry from './Inquiry.js'
import InquiryThread from './InquiryThread.js'
import Wishlist from './Wishlist.js'
import Payment from './Payment.js'
import Promo from './Promo.js'
import Refund from './Refund.js'

// Every association names its foreignKey, so Sequelize does not create duplicate columns.

// A user raises many inquiries
User.hasMany(Inquiry, { foreignKey: 'userId' })
Inquiry.belongsTo(User, { foreignKey: 'userId' })

// An inquiry has many thread replies (inquiry_id points to Inquiry.id)
Inquiry.hasMany(InquiryThread, { foreignKey: 'inquiry_id' })
InquiryThread.belongsTo(Inquiry, { foreignKey: 'inquiry_id' })

// A user writes many thread replies
User.hasMany(InquiryThread, { foreignKey: 'userId' })
InquiryThread.belongsTo(User, { foreignKey: 'userId' })

// A user has many orders; an order has many payments and refunds
User.hasMany(Order, { foreignKey: 'userId' })
Order.belongsTo(User, { foreignKey: 'userId' })
Order.hasMany(Payment, { foreignKey: 'orderId' })
Payment.belongsTo(Order, { foreignKey: 'orderId' })
Order.hasMany(Refund, { foreignKey: 'orderId' })
Refund.belongsTo(Order, { foreignKey: 'orderId' })

// The staff member who processed a refund
Refund.belongsTo(User, { foreignKey: 'processedBy', as: 'processor' })

// Super many-to-many: Users and Courses through Wishlist
// Special methods you get for free: user.addCourse(course), user.getCourses(), user.removeCourse(course)
User.belongsToMany(Course, { through: Wishlist, foreignKey: 'userId', otherKey: 'courseId' })
Course.belongsToMany(User, { through: Wishlist, foreignKey: 'courseId', otherKey: 'userId' })
Wishlist.belongsTo(User, { foreignKey: 'userId' })
Wishlist.belongsTo(Course, { foreignKey: 'courseId' })
User.hasMany(Wishlist, { foreignKey: 'userId' })
Course.hasMany(Wishlist, { foreignKey: 'courseId' })

export { sequelize, User, Course, Order, Inquiry, InquiryThread, Wishlist, Payment, Promo, Refund }