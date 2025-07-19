import { drizzle } from 'drizzle-orm/mysql2'
import { createConnection } from 'mysql2/promise'

import { env } from '../env'
import * as schema from './schema'

const client = await createConnection({
  host: env.MYSQL_HOST,
  port: env.MYSQL_PORT,
  database: env.MYSQL_DATABASE,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
})

export const db = drizzle({
  client,
  casing: 'snake_case',
  mode: 'default',
  schema,
})
