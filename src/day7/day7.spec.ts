import day7, {
  one,
  two,
  parseInput,
  getFaceValues,
  convertJokers,
  getHandType,
  sortHandsByRankLowToHigh,
  calculateTotalWinnings,
  HandType,
} from "./index";

const testInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const hands = [
  { value: "32T3K", bid: 765, type: HandType.OnePair },
  { value: "T55J5", bid: 684, type: HandType.ThreeOfAKind },
  { value: "KK677", bid: 28, type: HandType.TwoPair },
  { value: "KTJJT", bid: 220, type: HandType.TwoPair },
  { value: "QQQJA", bid: 483, type: HandType.ThreeOfAKind },
];

const handsWithJokers = [
  { value: "32T3K", bid: 765, type: HandType.OnePair },
  { value: "T55J5", bid: 684, type: HandType.FourOfAKind },
  { value: "KK677", bid: 28, type: HandType.TwoPair },
  { value: "KTJJT", bid: 220, type: HandType.FourOfAKind },
  { value: "QQQJA", bid: 483, type: HandType.FourOfAKind },
];

const handsSortedByRankLowToHigh = [
  { value: "32T3K", bid: 765, type: HandType.OnePair },
  { value: "KTJJT", bid: 220, type: HandType.TwoPair },
  { value: "KK677", bid: 28, type: HandType.TwoPair },
  { value: "T55J5", bid: 684, type: HandType.ThreeOfAKind },
  { value: "QQQJA", bid: 483, type: HandType.ThreeOfAKind },
];

const handsSortedByRankLowToHighWithJokers = [
  { value: "32T3K", bid: 765, type: HandType.OnePair },
  { value: "KK677", bid: 28, type: HandType.TwoPair },
  { value: "T55J5", bid: 684, type: HandType.FourOfAKind },
  { value: "QQQJA", bid: 483, type: HandType.FourOfAKind },
  { value: "KTJJT", bid: 220, type: HandType.FourOfAKind },
];

describe("On Day 7", () => {
  describe("Utils", () => {
    it.each([
      ["32T3K", { "3": 2, "2": 1, T: 1, K: 1 }],
      ["T55J5", { T: 1, "5": 3, J: 1 }],
      ["KK677", { K: 2, "6": 1, "7": 2 }],
      ["KTJJT", { K: 1, T: 2, J: 2 }],
      ["QQQJA", { Q: 3, J: 1, A: 1 }],
    ])("should get face values", (handValue, faceValues) => {
      expect(getFaceValues(handValue)).toEqual(faceValues);
    });

    it.each([
      [
        { "3": 2, "2": 1, T: 1, K: 1 },
        { "3": 2, "2": 1, T: 1, K: 1 },
      ],
      [
        { T: 1, "5": 3, J: 1 },
        { T: 1, "5": 4 },
      ],
      [
        { K: 2, "6": 1, "7": 2 },
        { K: 2, "6": 1, "7": 2 },
      ],
      [
        { K: 1, T: 2, J: 2 },
        { K: 1, T: 4 },
      ],
      [
        { Q: 3, J: 1, A: 1 },
        { Q: 4, A: 1 },
      ],
    ])("should convert jokers", (faceValues, converted) => {
      expect(convertJokers(faceValues)).toEqual(converted);
    });

    it.each([
      ["32T3K", HandType.OnePair],
      ["T55J5", HandType.ThreeOfAKind],
      ["KK677", HandType.TwoPair],
      ["KTJJT", HandType.TwoPair],
      ["QQQJA", HandType.ThreeOfAKind],
    ])("should get hand type", (value, type) => {
      expect(getHandType(value, false)).toEqual(type);
    });

    it.each([
      ["32T3K", HandType.OnePair],
      ["T55J5", HandType.FourOfAKind],
      ["KK677", HandType.TwoPair],
      ["KTJJT", HandType.FourOfAKind],
      ["QQQJA", HandType.FourOfAKind],
    ])("should get hand type (handle jokers)", (value, type) => {
      expect(getHandType(value, true)).toEqual(type);
    });

    it("should parse input", () => {
      expect(parseInput(testInput)).toEqual(hands);
    });

    it("should sort hands by rank low to high", () => {
      expect(sortHandsByRankLowToHigh(hands)).toEqual(
        handsSortedByRankLowToHigh,
      );
    });

    it("should sort hands by rank low to high (handle jokers)", () => {
      expect(sortHandsByRankLowToHigh(handsWithJokers, true)).toEqual(
        handsSortedByRankLowToHighWithJokers,
      );
    });

    it("should get total winnings", () => {
      expect(calculateTotalWinnings(hands)).toEqual(6440);
    });
  });

  it(`should resolve part 1`, () => {
    expect(one(testInput)).toBe("6440");
  });

  it(`should resolve part 2`, () => {
    expect(two(testInput)).toBe("5905");
  });
});
