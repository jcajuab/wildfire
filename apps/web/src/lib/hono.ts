import type { AppType } from "../../../api/src/app"
import { hc } from "hono/client"

export const honoClient = hc<AppType>(window.location.origin)
export type HonoClient = typeof honoClient
