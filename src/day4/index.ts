import fs from "fs";

type Card = {
  id: number;
  numbers: number[];
  winning: number[];
};

type CardInstance = Card & {
  isCopy: boolean;
};

const getId = (input: string): number => {
  const idStr = input.match(/\d+/)?.at(0);
  return idStr ? +idStr : 0;
};

const getNumbers = (input: string): number[] => {
  return input
    .split(" ")
    .filter((item) => !!item)
    .map((item) => +item);
};

const getCards = (input: string): Card[] => {
  return input.split(/\r?\n/).map((card) => {
    const [cardIdStr, gameNumbersStr] = card.split(": ");
    const [numbersStr, winningStr] = gameNumbersStr.split(" | ");
    return {
      id: getId(cardIdStr),
      numbers: getNumbers(numbersStr),
      winning: getNumbers(winningStr),
    };
  });
};

const playCard = (card: Card): number[] => {
  return card.numbers.filter((num) => card.winning.includes(num));
};

const getCardPoints = (winningNumbers: number[]): number => {
  return winningNumbers.reduce((points, item) => (points ? points * 2 : 1), 0);
};

const getTotalPoints = (cards: Card[]): number => {
  return cards
    .map((card) => {
      const winningNumbers = playCard(card);
      return getCardPoints(winningNumbers);
    })
    .reduce((total, cardPoints) => total + cardPoints, 0);
};

const getWonCopies = (
  winningCardId: number,
  numOfWins: number,
  cards: CardInstance[],
): CardInstance[] => {
  const wonCopyIds: number[] = new Array(numOfWins)
    .fill(winningCardId + 1)
    .map((item, index) => item + index);
  return cards
    .filter((card) => wonCopyIds.includes(card.id))
    .map((card) => ({ ...card, isCopy: true }));
};

const getCardInstances = (
  instances: CardInstance[],
  originalCards: CardInstance[],
): CardInstance[] => {
  return instances.flatMap((card) => {
    const numOfWins = playCard(card).length;
    const wonCopies = getWonCopies(card.id, numOfWins, originalCards);
    return [card, ...getCardInstances(wonCopies, originalCards)];
  });
};

export const one = (input: string): string => {
  const cards = getCards(input);
  return getTotalPoints(cards).toString();
};
export const two = (input: string): string => {
  const cards = getCards(input);
  const originalCards = cards.map((card) => ({ ...card, isCopy: false }));
  const instances = getCardInstances(originalCards, originalCards);
  return `${instances.length}`;
};

const partOne = async () => {
  const input = await fs.promises.readFile(`./inputs/day4/part1.txt`);
  return one(input.toString());
};
const partTwo = async () => {
  const input = await fs.promises.readFile(`./inputs/day4/part2.txt`);
  return two(input.toString());
};

export default { partOne, partTwo };
