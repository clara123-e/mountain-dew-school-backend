
import { Router } from 'express'
import {
  getSchoolClasses,
  createSchoolClass,
} from '../controllers/schoolClass.controller.js'
import {
  verifyToken,
  requireRole,
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(verifyToken, requireRole('admin'))

router.get('/', getSchoolClasses)
router.post('/', createSchoolClass)

export default router
