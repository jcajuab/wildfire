import { describe, expect, test } from "bun:test";
import {
  isValidDaysOfWeek,
  isValidTime,
  isWithinTimeWindow,
} from "#/domain/schedules/schedule";

describe("schedule helpers", () => {
  test("validates time format", () => {
    expect(isValidTime("08:00")).toBe(true);
    expect(isValidTime("23:59")).toBe(true);
    expect(isValidTime("24:00")).toBe(false);
    expect(isValidTime("8:00")).toBe(false);
  });

  test("validates days of week", () => {
    expect(isValidDaysOfWeek([0, 1, 2])).toBe(true);
    expect(isValidDaysOfWeek([])).toBe(false);
    expect(isValidDaysOfWeek([7])).toBe(false);
  });

  test("checks time window including overnight", () => {
    expect(isWithinTimeWindow("09:00", "08:00", "17:00")).toBe(true);
    expect(isWithinTimeWindow("18:00", "08:00", "17:00")).toBe(false);
    expect(isWithinTimeWindow("01:00", "22:00", "02:00")).toBe(true);
  });
});
