import { env as rawEnv } from 'bun'
import { z } from 'zod'

const SharedEnvSchema = z.object({
  TZ: z.string(),

  PORT: z.coerce.number().default(3000),

  MYSQL_ROOT_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
  MYSQL_USER: z.string(),
  MYSQL_PASSWORD: z.string(),
})

const DevelopmentEnvSchema = z.object({
  ...SharedEnvSchema.shape,

  NODE_ENV: z.literal('development'),

  MYSQL_HOST: z.string().default('localhost'),
  MYSQL_PORT: z.coerce.number().default(3306),
})

const ProductionEnvSchema = z.object({
  ...SharedEnvSchema.shape,

  NODE_ENV: z.literal('production'),

  MYSQL_HOST: z.string(),
  MYSQL_PORT: z.coerce.number(),
})

const EnvSchema = z.discriminatedUnion('NODE_ENV', [DevelopmentEnvSchema, ProductionEnvSchema])

const { success, data, error } = EnvSchema.safeParse(rawEnv)

if (!success) {
  console.error(JSON.stringify(z.treeifyError(error).properties, null, 2))
  process.exit(1)
}

export const env = data
