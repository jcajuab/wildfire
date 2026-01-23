import { describe, expect, test } from "bun:test";
import {
  isValidDuration,
  isValidSequence,
  nextSequence,
} from "#/domain/playlists/playlist";

describe("playlist helpers", () => {
  test("validates sequences and durations", () => {
    expect(isValidSequence(10)).toBe(true);
    expect(isValidSequence(0)).toBe(false);
    expect(isValidSequence(2.5)).toBe(false);

    expect(isValidDuration(15)).toBe(true);
    expect(isValidDuration(-1)).toBe(false);
  });

  test("computes next sequence with gaps", () => {
    expect(nextSequence([])).toBe(10);
    expect(nextSequence([10, 30, 20])).toBe(40);
  });
});
