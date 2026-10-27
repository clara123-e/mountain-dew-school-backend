
import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const ParentLearnerLink = sequelize.define(
  'ParentLearnerLink',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    learnerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Learners',
        key: 'id',
      },
    },
    relationship: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['mother', 'father', 'guardian', 'other']],
      },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'approved', 'rejected']],
      },
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['parentId', 'learnerId'],
      },
    ],
  }
)

export default ParentLearnerLink
