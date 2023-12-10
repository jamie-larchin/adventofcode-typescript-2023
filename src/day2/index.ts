import fs from "fs";

type ColourKeys = "red" | "green" | "blue";

type Set = Record<ColourKeys, number>;

type Game = {
  id: number;
  sets: Set[];
};

const CAPACITY: Set = {
  red: 12,
  green: 13,
  blue: 14,
};

const BASE_SET: Set = {
  red: 0,
  green: 0,
  blue: 0,
};

const getId = (input: string): number => {
  const idStr = input.match(/\d+/)?.at(0);
  return idStr ? +idStr : 0;
};

const isColour = (input: string): input is ColourKeys =>
  ["red", "green", "blue"].includes(input);

const getSets = (input: string): Set[] => {
  return input.split("; ").map((set) => {
    return set.split(", ").reduce((acc: Set, item) => {
      const [count, colour] = item.split(" ");
      if (!isColour(colour)) return acc;
      return { ...acc, [colour]: +count };
    }, BASE_SET);
  });
};

const getGamesMeta = (input: string): Game[] => {
  return input.split(/\r?\n/).map((game) => {
    const [gameStr, setsStr] = game.split(": ");
    return {
      id: getId(gameStr),
      sets: getSets(setsStr),
    };
  });
};

const getMinimumCapacities = (sets: Set[]): Set => {
  return sets.reduce(
    (acc, set) => ({
      red: Math.max(acc.red, set.red),
      green: Math.max(acc.green, set.green),
      blue: Math.max(acc.blue, set.blue),
    }),
    BASE_SET,
  );
};

export const one = (input: string): string => {
  const games = getGamesMeta(input);

  const gamesUnderCapacity = games.filter((game) => {
    return game.sets.reduce((isUnderCapacity: boolean, set) => {
      if (!isUnderCapacity) return false;
      return (
        set.red <= CAPACITY.red &&
        set.green <= CAPACITY.green &&
        set.blue <= CAPACITY.blue
      );
    }, true);
  });

  return gamesUnderCapacity.reduce((acc, game) => acc + game.id, 0).toString();
};

export const two = (input: string): string => {
  const games = getGamesMeta(input);

  const total = games
    .map((game) => getMinimumCapacities(game.sets))
    .map(({ red, green, blue }) => red * green * blue)
    .reduce((acc, item) => acc + item, 0);

  return total.toString();
};

const partOne = async () => {
  const input = await fs.promises.readFile(`./inputs/day2/part1.txt`);
  return one(input.toString());
};
const partTwo = async () => {
  const input = await fs.promises.readFile(`./inputs/day2/part2.txt`);
  return two(input.toString());
};

export default { partOne, partTwo };
