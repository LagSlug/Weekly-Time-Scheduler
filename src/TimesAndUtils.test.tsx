import times from "./components/weekly-time-scheduler/times";
import { hasIntersection } from "./components/weekly-time-scheduler/utility";

describe("Times component", () => {
  test("should contain 48 time slots", () => {
    expect(times.length).toBe(48);
  });

  test("should start with 12 AM", () => {
    expect(times[0]).toBe("12 AM");
  });

  test("should end with 12 AM", () => {
    expect(times[times.length - 1]).toBe("12 AM");
  });
});

describe("Utils component", () => {
  test("should return true for intersecting spans", () => {
    const spans: [number, number][] = [
      [0, 5],
      [4, 10],
      [9, 15],
    ];
    expect(hasIntersection(spans)).toBe(true);
  });

  test("should return false for non-intersecting spans", () => {
    const spans: [number, number][] = [
      [0, 5],
      [6, 10],
      [11, 15],
    ];
    expect(hasIntersection(spans)).toBe(false);
  });

  test("should return true for partially overlapping spans", () => {
    const spans: [number, number][] = [
      [0, 5],
      [5, 10],
      [9, 15],
    ];
    expect(hasIntersection(spans)).toBe(true);
  });

  test("should return true for identical spans", () => {
    const spans: [number, number][] = [
      [0, 5],
      [0, 5],
      [0, 5],
    ];
    expect(hasIntersection(spans)).toBe(true);
  });
});
