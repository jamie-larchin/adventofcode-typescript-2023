import { one, two } from "./index";

const testInput1 = `hello`;

const testInput2 = `hello`;

describe("On Day 0", () => {
  it(`should resolve part 1`, () => {
    expect(one(testInput1)).toBe("hello");
  });
  it(`should resolve part 2`, () => {
    expect(two(testInput2)).toBe("hello");
  });
});
