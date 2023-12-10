import fs from "fs";

export enum HandType {
  FiveOfAKind = "FiveOfAKind",
  FourOfAKind = "FourOfAKind",
  FullHouse = "FullHouse",
  ThreeOfAKind = "ThreeOfAKind",
  TwoPair = "TwoPair",
  OnePair = "OnePair",
  HighCard = "HighCard",
}

type Hand = {
  value: string;
  bid: number;
  type: HandType;
};

type FaceValues = Record<string, number>;

const handTypeMap: Record<HandType, number> = {
  [HandType.FiveOfAKind]: 7,
  [HandType.FourOfAKind]: 6,
  [HandType.FullHouse]: 5,
  [HandType.ThreeOfAKind]: 4,
  [HandType.TwoPair]: 3,
  [HandType.OnePair]: 2,
  [HandType.HighCard]: 1,
};

const cardValueMap: Record<string, string> = {
  A: "a",
  K: "b",
  Q: "c",
  J: "d",
  T: "e",
  "9": "f",
  "8": "g",
  "7": "h",
  "6": "i",
  "5": "j",
  "4": "k",
  "3": "l",
  "2": "m",
};

const cardValueMapWithJokers: Record<string, string> = {
  A: "a",
  K: "b",
  Q: "c",
  T: "d",
  "9": "e",
  "8": "f",
  "7": "g",
  "6": "h",
  "5": "i",
  "4": "j",
  "3": "k",
  "2": "l",
  J: "m",
};

export const getFaceValues = (value: string): FaceValues => {
  return (value.match(/\w/g) ?? []).reduce((hand: FaceValues, faceValue) => {
    const existingFaceValue = hand[faceValue];
    return {
      ...hand,
      [faceValue]: existingFaceValue ? existingFaceValue + 1 : 1,
    };
  }, {});
};

export const convertJokers = ({
  J: jokerTally = 0,
  ...hand
}: FaceValues): FaceValues => {
  const highestTally = Math.max(...Object.values(hand));
  const [faceValue] =
    Object.entries(hand).find(([, tally]) => tally === highestTally) ?? [];
  return faceValue
    ? { ...hand, [faceValue]: highestTally + jokerTally }
    : { ...hand, J: jokerTally };
};

export const getHandType = (value: string, handleJokers: boolean): HandType => {
  const faceValueTallys = handleJokers
    ? convertJokers(getFaceValues(value))
    : getFaceValues(value);
  const faceValueKeys = Object.keys(faceValueTallys);
  const faceValueCounts = Object.values(faceValueTallys);
  switch (true) {
    case faceValueKeys.length === 1:
      return HandType.FiveOfAKind;
    case faceValueKeys.length === 2 && faceValueCounts.includes(4):
      return HandType.FourOfAKind;
    case faceValueKeys.length === 2 && faceValueCounts.includes(3):
      return HandType.FullHouse;
    case faceValueKeys.length === 3 && faceValueCounts.includes(3):
      return HandType.ThreeOfAKind;
    case faceValueKeys.length === 3 && faceValueCounts.includes(2):
      return HandType.TwoPair;
    case faceValueKeys.length === 4:
      return HandType.OnePair;
    default:
      return HandType.HighCard;
  }
};

export const parseInput = (input: string, handleJokers = false): Hand[] => {
  return input.split(/\r?\n/).reduce((hands: Hand[], str) => {
    const parsed = str.match(/\w+/g);
    if (parsed?.length !== 2) return hands;
    const [value, bid] = parsed;
    return [
      ...hands,
      { value, bid: Number(bid), type: getHandType(value, handleJokers) },
    ];
  }, []);
};

const mapHandToAlphaValue = (value: string, handleJokers: boolean): string =>
  value
    .split("")
    .map((item) =>
      handleJokers ? cardValueMapWithJokers[item] : cardValueMap[item],
    )
    .join("");

const compareHandType = (a: HandType, b: HandType): number => {
  return handTypeMap[a] > handTypeMap[b] ? 1 : -1;
};

const compareHandValue = (
  a: string,
  b: string,
  handleJokers: boolean,
): number => {
  return mapHandToAlphaValue(a, handleJokers) <
    mapHandToAlphaValue(b, handleJokers)
    ? 1
    : -1;
};

export const sortHandsByRankLowToHigh = (
  hands: Hand[],
  handleJokers = false,
): Hand[] => {
  return hands.sort((a, b) => {
    if (a.type === b.type)
      return compareHandValue(a.value, b.value, handleJokers);
    return compareHandType(a.type, b.type);
  });
};

export const calculateTotalWinnings = (hands: Hand[]): number => {
  return hands.reduce((totalWinnings, hand, index) => {
    const rank = index + 1;
    return totalWinnings + hand.bid * rank;
  }, 0);
};

export const one = (input: string): string => {
  const hands = parseInput(input);
  const sorted = sortHandsByRankLowToHigh(hands);
  return `${calculateTotalWinnings(sorted)}`;
};

export const two = (input: string): string => {
  const hands = parseInput(input, true);
  const sorted = sortHandsByRankLowToHigh(hands, true);
  return `${calculateTotalWinnings(sorted)}`;
};

const partOne = async () => {
  const input = await fs.promises.readFile(`./inputs/day7/part1.txt`);
  return one(input.toString());
};
const partTwo = async () => {
  const input = await fs.promises.readFile(`./inputs/day7/part2.txt`);
  return two(input.toString());
};

export default { partOne, partTwo };
