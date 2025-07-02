import { int, mysqlTable } from 'drizzle-orm/mysql-core'

// TODO
export const users = mysqlTable('users', {
  id: int(),
})
