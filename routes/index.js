
import authRoute from './auth.route.js'
import schoolClassRoute from './schoolClass.route.js'

export function mountRoutes(app) {
  app.use('/api/auth', authRoute)
  app.use('/api/admin/classes', schoolClassRoute)

  // Other existing routes should remain registered here.
}
