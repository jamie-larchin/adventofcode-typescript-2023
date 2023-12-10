import {
  one,
  two,
  parseDirections,
  parseNetwork,
  navigateNetwork,
  Direction,
} from "./index";

const testInput1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const testInput2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const testInput3 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

const directions1: Direction[] = [Direction.Right, Direction.Left];
const directions2: Direction[] = [
  Direction.Left,
  Direction.Left,
  Direction.Right,
];

const network1 = {
  AAA: { left: "BBB", right: "CCC" },
  BBB: { left: "DDD", right: "EEE" },
  CCC: { left: "ZZZ", right: "GGG" },
  DDD: { left: "DDD", right: "DDD" },
  EEE: { left: "EEE", right: "EEE" },
  GGG: { left: "GGG", right: "GGG" },
  ZZZ: { left: "ZZZ", right: "ZZZ" },
};

const network2 = {
  AAA: { left: "BBB", right: "BBB" },
  BBB: { left: "AAA", right: "ZZZ" },
  ZZZ: { left: "ZZZ", right: "ZZZ" },
};

describe("On Day 8", () => {
  describe("Utils", () => {
    it.each([
      [testInput1, directions1],
      [testInput2, directions2],
    ])(`should parse the directions`, (input, result) => {
      expect(parseDirections(input)).toEqual(result);
    });

    it.each([
      [testInput1, network1],
      [testInput2, network2],
    ])(`should parse the network`, (input, result) => {
      expect(parseNetwork(input)).toEqual(result);
    });

    it.each([
      [directions1, network1, 2],
      [directions2, network2, 6],
    ])(`should navigate from AAA to ZZZ`, (directions, network, result) => {
      expect(navigateNetwork(directions, network)).toBe(result);
    });
  });

  it.each([
    [testInput1, "2"],
    [testInput2, "6"],
  ])(`should resolve part 1`, (input, result) => {
    expect(one(input)).toBe(result);
  });

  it.skip(`should resolve part 2`, () => {
    expect(two(testInput3)).toBe("6");
  });
});
