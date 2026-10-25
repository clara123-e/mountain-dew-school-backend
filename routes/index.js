import authRoute from './auth.route.js'

export function mountRoutes(app) {
  app.use('/api/auth', authRoute)
  // Inquiry, wishlist and the other routers are added here next, behind verifyToken
}