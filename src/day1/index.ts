import fs from "fs";

const digitMap: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

export const one = (input: string): string => {
  const result = input
    .split(/\r?\n/)
    .map((item) => {
      const digits = item.match(/\d/g) ?? [];
      const first = digits.at(0);
      const last = digits.at(-1);
      return `${first}${last}`;
    })
    .reduce((acc, item) => +item + acc, 0);

  return `${result}`;
};

export const two = (input: string): string => {
  const items = input.split(/\r?\n/);
  const result = items
    .map((item) =>
      item
        .split(/(one|two|three|four|five|six|seven|eight|nine|\d)/g)
        .map((part) =>
          Object.keys(digitMap).includes(part) ? digitMap[part] : part,
        )
        .filter((part) => part.match(/\d/g)),
    )
    .map((parts) => {
      const first = parts.at(0)!;
      const last = parts.at(-1)!;
      return `${first}${last}`;
    })
    .reduce((acc, item) => +item + acc, 0);

  return `${result}`;
};

const partOne = async () => {
  const input = await fs.promises.readFile(`./inputs/day1/part1.txt`);
  return one(input.toString());
};

const partTwo = async () => {
  const input = await fs.promises.readFile(`./inputs/day1/part2.txt`);
  return two(input.toString());
};

export default { partOne, partTwo };
