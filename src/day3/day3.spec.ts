import { one, two } from "./index";

const testInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

describe("On Day 3", () => {
  it(`should resolve part 1`, () => {
    expect(one(testInput)).toBe("4361");
  });
  it(`should resolve part 2`, () => {
    expect(two(testInput)).toBe("467835");
  });
});
