import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

// Hosted databases (Supabase, Render) use DATABASE_URL. Local setups use the separate DB_* values.
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    })

export async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error.message)
  }
}

export default sequelize