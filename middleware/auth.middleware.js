import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' })
  }
}

// Use after verifyToken: router.get('/x', verifyToken, requireRole('teacher'), handler)
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to do this.' })
    }
    next()
  }
}