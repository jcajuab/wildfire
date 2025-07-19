import { os } from './implementer'
import { loggerMiddleware } from './middlewares/logger.middleware'

const baseProcedure = os.use(loggerMiddleware)

export const publicProcedure = baseProcedure

// TODO: Add a proper auth logic. See: https://orpc.unnoq.com/docs/middleware#middleware-context
export const privateProcedure = baseProcedure
