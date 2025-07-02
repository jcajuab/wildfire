import { os } from '@/orpc'
import { ping } from '@/orpc/routes/ping.route'

export const router = os.router({
  public: {
    ping,
  },
})
