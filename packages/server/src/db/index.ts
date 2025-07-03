import { drizzle } from 'drizzle-orm/mysql2'
import { createConnection } from 'mysql2/promise'
import * as schema from '@/db/schema'

const client = await createConnection({
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
})

export const db = drizzle({
  client,
  casing: 'snake_case',
  mode: 'default',
  schema,
})
