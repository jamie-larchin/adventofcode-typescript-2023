import {
  one,
  two,
  parseInput1,
  parseInput2,
  canRaceWin,
  getWinOpportunitiesCount,
  getTotalWinOpportunitiesCount,
  getFirstWinOpportunity,
  getLastWinOpportunity,
} from "./index";

const testInput = `Time:      7  15   30
Distance:  9  40  200`;

describe("On Day 6", () => {
  describe("Utils", () => {
    it("should parse input 1", () => {
      expect(parseInput1(testInput)).toEqual([
        { time: 7, distance: 9 },
        { time: 15, distance: 40 },
        { time: 30, distance: 200 },
      ]);
    });

    it("should parse input 2", () => {
      expect(parseInput2(testInput)).toEqual({ time: 71530, distance: 940200 });
    });

    it.each([
      [1, false],
      [2, true],
      [3, true],
      [4, true],
      [5, true],
      [6, false],
    ])("should determine if race can win", (chargingTime, raceCanWin) => {
      expect(canRaceWin(chargingTime, { time: 7, distance: 9 })).toBe(
        raceCanWin,
      );
    });

    it("should get first win opportunity", () => {
      expect(getFirstWinOpportunity({ time: 7, distance: 9 })).toEqual(2);
    });

    it("should get last win opportunity", () => {
      expect(getLastWinOpportunity({ time: 7, distance: 9 })).toEqual(5);
    });

    it.each([
      { time: 7, distance: 9, count: 4 },
      { time: 15, distance: 40, count: 8 },
      { time: 30, distance: 200, count: 9 },
    ])("should get win opportunities count", ({ time, distance, count }) => {
      expect(getWinOpportunitiesCount({ time, distance })).toEqual(count);
    });

    it("should get total race opportunities", () => {
      expect(
        getTotalWinOpportunitiesCount([
          { time: 7, distance: 9 },
          { time: 15, distance: 40 },
          { time: 30, distance: 200 },
        ]),
      ).toEqual(288);
    });
  });

  it(`should resolve part 1`, () => {
    expect(one(testInput)).toBe("288");
  });

  it(`should resolve part 2`, () => {
    expect(two(testInput)).toBe("71503");
  });
});
