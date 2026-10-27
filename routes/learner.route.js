
import { Router } from 'express'
import {
  getLearners,
  createLearner,
  requestLearnerLink,
  getMyLearners,
  getPendingLearnerLinks,
  reviewLearnerLink,
} from '../controllers/learner.controller.js'
import {
  verifyToken,
  requireRole,
} from '../middleware/auth.middleware.js'

const router = Router()

// Administrator: manage learner records
router.get(
  '/admin/learners',
  verifyToken,
  requireRole('admin'),
  getLearners
)

router.post(
  '/admin/learners',
  verifyToken,
  requireRole('admin'),
  createLearner
)

// Administrator: review parent-learner link requests
router.get(
  '/admin/learner-links/pending',
  verifyToken,
  requireRole('admin'),
  getPendingLearnerLinks
)

router.patch(
  '/admin/learner-links/:id',
  verifyToken,
  requireRole('admin'),
  reviewLearnerLink
)

// Parent: request a link and view approved learners
router.post(
  '/parent/learner-links',
  verifyToken,
  requireRole('parent'),
  requestLearnerLink
)

router.get(
  '/parent/learners',
  verifyToken,
  requireRole('parent'),
  getMyLearners
)

export default router
