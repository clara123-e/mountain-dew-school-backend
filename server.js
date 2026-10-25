import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './config/database.js'
import { sequelize } from './models/index.js'
import { mountRoutes } from './routes/index.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL }))
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

start()