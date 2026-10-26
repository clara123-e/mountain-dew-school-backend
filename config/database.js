import { Sequelize } from 'sequelize'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Explicitly provide the PostgreSQL driver to Sequelize.
const commonOptions = {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
}

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      ...commonOptions,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...commonOptions,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
      }
    )

export async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error.message)
    throw error
  }
}

export default sequelize
