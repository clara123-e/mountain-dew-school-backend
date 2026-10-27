
import sequelize from '../config/database.js'
import User from './User.js'
import Course from './Course.js'
import SchoolClass from './SchoolClass.js'
import Learner from './Learner.js'
import ParentLearnerLink from './ParentLearnerLink.js'
import Order from './Order.js'
import Inquiry from './Inquiry.js'
import InquiryThread from './InquiryThread.js'
import Wishlist from './Wishlist.js'
import Payment from './Payment.js'
import Promo from './Promo.js'
import Refund from './Refund.js'

// Existing user and inquiry associations
User.hasMany(Inquiry, { foreignKey: 'userId' })
Inquiry.belongsTo(User, { foreignKey: 'userId' })

Inquiry.hasMany(InquiryThread, { foreignKey: 'inquiry_id' })
InquiryThread.belongsTo(Inquiry, { foreignKey: 'inquiry_id' })

User.hasMany(InquiryThread, { foreignKey: 'userId' })
InquiryThread.belongsTo(User, { foreignKey: 'userId' })

// Existing order, payment and refund associations
User.hasMany(Order, { foreignKey: 'userId' })
Order.belongsTo(User, { foreignKey: 'userId' })

Order.hasMany(Payment, { foreignKey: 'orderId' })
Payment.belongsTo(Order, { foreignKey: 'orderId' })

Order.hasMany(Refund, { foreignKey: 'orderId' })
Refund.belongsTo(Order, { foreignKey: 'orderId' })

Refund.belongsTo(User, {
  foreignKey: 'processedBy',
  as: 'processor',
})

// Existing wishlist associations
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

// A learner belongs to a school class
SchoolClass.hasMany(Learner, {
  foreignKey: 'schoolClassId',
  as: 'learners',
})

Learner.belongsTo(SchoolClass, {
  foreignKey: 'schoolClassId',
  as: 'schoolClass',
})

// Parent accounts can request links to multiple learners
User.hasMany(ParentLearnerLink, {
  foreignKey: 'parentId',
  as: 'learnerLinks',
})

ParentLearnerLink.belongsTo(User, {
  foreignKey: 'parentId',
  as: 'parent',
})

// Each learner can have multiple parent or guardian links
Learner.hasMany(ParentLearnerLink, {
  foreignKey: 'learnerId',
  as: 'parentLinks',
})

ParentLearnerLink.belongsTo(Learner, {
  foreignKey: 'learnerId',
  as: 'learner',
})

// Record which administrator reviewed a link request
User.hasMany(ParentLearnerLink, {
  foreignKey: 'reviewedBy',
  as: 'reviewedLearnerLinks',
})

ParentLearnerLink.belongsTo(User, {
  foreignKey: 'reviewedBy',
  as: 'reviewer',
})

// Export all models
export {
  sequelize,
  User,
  Course,
  SchoolClass,
  Learner,
  ParentLearnerLink,
  Order,
  Inquiry,
  InquiryThread,
  Wishlist,
  Payment,
  Promo,
  Refund,
}
