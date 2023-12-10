import fs from "fs";

type Race = {
  time: number;
  distance: number;
};

export const parseInput1 = (input: string): Race[] => {
  const [times = [], distances = []] = input.split(/\r?\n/).map((str) => {
    const [, valuesStr] = str.split(":");
    return valuesStr.match(/\d+/g)?.map(Number);
  });
  return times.map((time, index) => ({
    time,
    distance: distances[index],
  }));
};

export const parseInput2 = (input: string): Race => {
  const [time, distance] = input
    .split(/\r?\n/)
    .map((str) => {
      const [, valuesStr] = str.split(":");
      return valuesStr.match(/\d+/g)?.join("");
    })
    .map(Number);
  return { time, distance };
};

const getOpportunities = (raceTime: number): number[] => {
  return new Array(raceTime - 1).fill(1).map((item, index) => item + index);
};

export const canRaceWin = (chargingTime: number, race: Race): boolean => {
  const racingTime = race.time - chargingTime;
  const distanceReached = racingTime * chargingTime;
  return distanceReached > race.distance;
};

export const getFirstWinOpportunity = (race: Race): number => {
  let index = 0;
  while (!canRaceWin(index, race)) {
    index++;
  }
  return index;
};

export const getLastWinOpportunity = (race: Race): number => {
  let index = race.time;
  while (!canRaceWin(index, race)) {
    index--;
  }
  return index;
};

export const getWinOpportunitiesCount = (race: Race): number => {
  const firstWinOpportunity = getFirstWinOpportunity(race);
  const lastWinOpportunity = getLastWinOpportunity(race);
  return lastWinOpportunity - firstWinOpportunity + 1;
};

export const getTotalWinOpportunitiesCount = (races: Race[]): number => {
  return races
    .map(getWinOpportunitiesCount)
    .reduce((totalWinOpportunities, winOpportunities) => {
      return totalWinOpportunities
        ? totalWinOpportunities * winOpportunities
        : winOpportunities;
    }, 0);
};

export const one = (input: string): string => {
  const races = parseInput1(input);
  return `${getTotalWinOpportunitiesCount(races)}`;
};
export const two = (input: string): string => {
  const race = parseInput2(input);
  return `${getWinOpportunitiesCount(race)}`;
};

const partOne = async () => {
  const input = await fs.promises.readFile(`./inputs/day6/part1.txt`);
  return one(input.toString());
};
const partTwo = async () => {
  const input = await fs.promises.readFile(`./inputs/day6/part2.txt`);
  return two(input.toString());
};

export default { partOne, partTwo };
