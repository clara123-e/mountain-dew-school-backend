import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './config/database.js'
import { sequelize } from './models/index.js'
import { mountRoutes } from './routes/index.js'

dotenv.config()

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Origin not allowed by CORS'))
    },
  }),
)
// express.json() must come BEFORE the routes, or req.body is empty
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Mountain Dew International School API is running' })
})

mountRoutes(app)

const PORT = process.env.PORT || 5000

async function start() {
  await testConnection()

  // WARNING: alter:true changes tables to match the models. Never leave DB_SYNC=true in production.
  if (process.env.DB_SYNC === 'true') {
    await sequelize.sync({ alter: true })
    console.log('Database tables synced.')
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

start().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})