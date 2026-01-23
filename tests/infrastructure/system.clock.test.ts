import { describe, expect, test } from "bun:test";
import { SystemClock } from "#/infrastructure/time/system.clock";

describe("SystemClock", () => {
  test("returns current time in seconds", () => {
    const originalNow = Date.now;
    Date.now = () => 1_700_000_123_456;

    try {
      const clock = new SystemClock();
      expect(clock.nowSeconds()).toBe(1_700_000_123);
    } finally {
      Date.now = originalNow;
    }
  });
});
