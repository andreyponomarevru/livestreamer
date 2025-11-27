import { describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";

import { isFutureTimestamp } from "./utils";
import { validateScheduleTimestamps } from "./utils";

describe("isFutureTimestamp", () => {
  it("returns true if timestamp is set in the future", () => {
    expect(isFutureTimestamp(faker.date.future().toISOString())).toBe(true);
  });

  it("returns false if timestamp is set in the past", () => {
    expect(isFutureTimestamp(faker.date.past().toISOString())).toBe(false);
  });

  it("returns false if timestamp is set to the current time", () => {
    expect(isFutureTimestamp(new Date().toISOString())).toBe(false);
  });
});

describe("validateScheduleTimestamps", () => {
  // now + 1sec
  const future1 = new Date().getTime() + 1000;
  const future2 = future1 + 1 * 60 * 60 * 1000;

  it("passes validation if both timestamps are set in the future and if an end timestamp is later than a start timestamp", () => {
    expect(() => {
      validateScheduleTimestamps(
        new Date(future1).toISOString(),
        new Date(future2).toISOString(),
      );
    }).not.toThrow();

    expect(
      validateScheduleTimestamps(
        new Date(future1).toISOString(),
        new Date(future2).toISOString(),
      ),
    ).toBe(true);
  });

  it("throws an error if any of timestamps is set to the current time", () => {
    expect(() =>
      validateScheduleTimestamps(
        new Date().toISOString(),
        new Date(future1).toISOString(),
      ),
    ).toThrow();

    expect(() =>
      validateScheduleTimestamps(
        new Date(future1).toISOString(),
        new Date().toISOString(),
      ),
    ).toThrow();
  });

  it("throws an error if a start timestamp is later than an end timestamp", () => {
    expect(() =>
      validateScheduleTimestamps(
        new Date(future2).toISOString(),
        new Date(future1).toISOString(),
      ),
    );
  });
});
