import type { PingService } from "./ping.service"

// Do not follow this naming convention; it's just an example, because honestly, what else would I even call it?
// For context, see: https://dev.to/adammc331/interface-naming-conventions-3m0o
export class PingServiceImpl implements PingService {
  ping(): string {
    return "pong"
  }
}
