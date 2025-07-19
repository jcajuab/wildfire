import { defineConfig } from 'drizzle-kit'

import { env } from './src/env'

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema/index.ts',
  dbCredentials: {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    database: env.MYSQL_DATABASE,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
  },
})
