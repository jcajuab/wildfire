import { os } from '@/lib/orpc'
import { ping } from '@/routes/ping.route'

export const router = os.router({
  public: {
    ping,
  },
})
