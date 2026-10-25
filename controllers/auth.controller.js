import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const SELF_SIGNUP_ROLES = ['parent', 'student']

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

function publicUser(user) {
  const { password, ...rest } = user.toJSON()
  return rest
}

function handleError(res, error) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ success: false, message: 'That email or username is already registered.' })
  }
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ success: false, message: error.errors.map((e) => e.message).join(', ') })
  }
  console.error(error)
  return res.status(500).json({ success: false, message: 'Server error.' })
}

async function register(req, res) {
  try {
    // notNull guard: show which fields arrived (never log the password itself)
    console.log('register body keys:', Object.keys(req.body))

    const { firstName, lastName, email, password, username } = req.body
    if (!firstName || !lastName || !email || !password || !username) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })
    }

    // Teacher and admin accounts are never created from the public form
    const role = SELF_SIGNUP_ROLES.includes(req.body.role) ? req.body.role : 'student'

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ firstName, lastName, email, username, password: hashed, role })

    return res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) })
  } catch (error) {
    return handleError(res, error)
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } })
    const valid = user && (await bcrypt.compare(password, user.password))
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    return res.status(200).json({ success: true, token: signToken(user), user: publicUser(user) })
  } catch (error) {
    return handleError(res, error)
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }
    return res.status(200).json({ success: true, data: publicUser(user) })
  } catch (error) {
    return handleError(res, error)
  }
}

export { register, login, getMe }