
import authRoute from './auth.route.js'
import schoolClassRoute from './schoolClass.route.js'
import learnerRoute from './learner.route.js'

export function mountRoutes(app) {
  app.use('/api/auth', authRoute)
  app.use('/api/admin/classes', schoolClassRoute)
  app.use('/api', learnerRoute)
}
