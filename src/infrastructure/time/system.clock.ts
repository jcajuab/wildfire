import { type Clock } from "#/application/ports/auth";

export class SystemClock implements Clock {
  nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }
}
