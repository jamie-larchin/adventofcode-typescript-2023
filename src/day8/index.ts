import fs from "fs";

export enum Direction {
  Left = "left",
  Right = "right",
}

const directionMap: Record<string, Direction> = {
  L: Direction.Left,
  R: Direction.Right,
};

type Network = Record<string, Record<Direction, string>>;

type NavigateNetworkConfig = {
  position: string;
  steps: number;
};

const START_NODE = "AAA";
const END_NODE = "ZZZ";
const DEFAULT_CONFIG: NavigateNetworkConfig = {
  position: START_NODE,
  steps: 0,
};

export const parseDirections = (input: string): Direction[] => {
  return (
    input
      .match(/\w+/)?.[0]
      .split("")
      .map((direction) => directionMap[direction]) ?? []
  );
};

export const parseNetwork = (input: string): [Network, string[]] => {
  const startPositions = [];
  const network = input
    .split(/\r?\n/)
    .slice(2)
    .reduce((network: Network, item) => {
      const [node, left, right] = item.match(/\w+/g) ?? [];
      if (node.includes("A")) startPositions.push(node);
      return { ...network, [node]: { left, right } };
    }, {});
  return [network, startPositions];
};

export const navigateNetwork = (
  directions: Direction[],
  network: Network,
  defaults?: { position: string; steps: number },
): number => {
  let steps = defaults?.steps ?? 0;
  let position = defaults?.position ?? START_NODE;
  for (const direction of directions) {
    if (position === END_NODE) break;
    steps++;
    position = network[position][direction];
  }
  if (position !== END_NODE)
    return navigateNetwork(directions, network, { position, steps });
  return steps;
};

export const one = (input: string): string => {
  const directions = parseDirections(input);
  const network = parseNetwork(input);
  return `${navigateNetwork(directions, network)}`;
};

export const two = (input: string): string => {
  const directions = parseDirections(input);
  const [network, startPositions] = parseNetwork(input);
  console.log(startPositions);

  return ``;
};

const partOne = async () => {
  const input = await fs.promises.readFile(`./inputs/day8/part1.txt`);
  return one(input.toString());
};
const partTwo = async () => {
  const input = await fs.promises.readFile(`./inputs/day8/part2.txt`);
  return two(input.toString());
};

export default { partOne, partTwo };
