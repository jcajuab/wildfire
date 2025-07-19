import { randomUUIDv7 } from 'bun'
import { mysqlTable, text, varchar } from 'drizzle-orm/mysql-core'

// TODO: Add a proper table definition
export const displays = mysqlTable('displays', {
  id: varchar({ length: 36 }).primaryKey().$default(randomUUIDv7),
  name: varchar({ length: 255 }).notNull().unique(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: text(),
})
