import { one, two } from "./index";

const testInput1 = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const testInput2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

describe("On Day 1", () => {
  it(`should resolve part 1`, () => {
    expect(one(testInput1)).toBe("142");
  });
  it(`should resolve part 2`, () => {
    expect(two(testInput2)).toBe("281");
  });
});
