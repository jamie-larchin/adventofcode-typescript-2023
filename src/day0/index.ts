import fs from "fs";

export const one = (input: string): string => {
  const result = input.split(/\r?\n/);
  return input;
};
export const two = (input: string): string => {
  const result = input.split(/\r?\n/);
  return input;
};

const partOne = async () => {
  const input = await fs.promises.readFile(`./inputs/day0/part1.txt`);
  return one(input.toString());
};
const partTwo = async () => {
  const input = await fs.promises.readFile(`./inputs/day0/part2.txt`);
  return two(input.toString());
};

export default { partOne, partTwo };
