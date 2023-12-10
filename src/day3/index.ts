import fs from "fs";

type Position = {
  line: number;
  range: [number, number];
};

type Meta = {
  type: "number" | "symbol";
  value: string;
  position: Position;
};

type Symbol = {
  value: string;
  line: number;
  linePosition: number;
};

type Gear = {
  line: number;
  linePosition: number;
  adjacentValues: [Meta, Meta];
};

const inRange = (value: number, min: number, max: number): boolean =>
  value >= min && value <= max;

const getMeta = (input: string): Meta[] => {
  return input
    .split(/\r?\n/)
    .map((schematicLine, index) => {
      const digitsAndSymbols = schematicLine.match(/\d+|\D/g) ?? [];
      return digitsAndSymbols.reduce((acc: Meta[], value) => {
        const prev = acc.at(-1);
        const startPos = prev ? prev.position.range[1] + 1 : 0;
        const endPos = startPos + value.length - 1;
        const metaItem: Meta = {
          value,
          type: isNaN(+value) ? "symbol" : "number",
          position: {
            line: index,
            range: [startPos, endPos],
          },
        };
        return [...acc, metaItem];
      }, []);
    })
    .flat()
    .filter((item) => item.value !== ".");
};

const getSymbols = (meta: Meta[]): Symbol[] => {
  return meta
    .filter((item) => item.type === "symbol")
    .map((item) => ({
      value: item.value,
      line: item.position.line,
      linePosition: item.position.range[0],
    }));
};

const isPartNumber = (item: Meta, symbols: Symbol[]) => {
  const { line, range } = item.position;
  return symbols
    .filter((symbol) => inRange(symbol.line, line - 1, line + 1))
    .some((symbol) => inRange(symbol.linePosition, range[0] - 1, range[1] + 1));
};

const getGearAdjacentValues = (item: Symbol, partNumbers: Meta[]): Meta[] => {
  return partNumbers
    .filter((partNumber) =>
      inRange(
        item.line,
        partNumber.position.line - 1,
        partNumber.position.line + 1,
      ),
    )
    .filter((partNumber) =>
      inRange(
        item.linePosition,
        partNumber.position.range[0] - 1,
        partNumber.position.range[1] + 1,
      ),
    );
};

const getPartNumbers = (meta: Meta[]): Meta[] => {
  const symbols = getSymbols(meta);
  return meta.filter(
    (item) => item.type === "number" && isPartNumber(item, symbols),
  );
};

const getGears = (meta: Meta[]): Gear[] => {
  const symbols = getSymbols(meta);
  const partNumbers = getPartNumbers(meta);
  return symbols
    .filter((symbol) => symbol.value === "*")
    .reduce((acc: Gear[], symbol) => {
      const adjacentValues = getGearAdjacentValues(symbol, partNumbers);
      if (adjacentValues.length < 2) return acc;
      const [adj1, adj2] = adjacentValues;
      return [
        ...acc,
        {
          line: symbol.line,
          linePosition: symbol.linePosition,
          adjacentValues: [adj1, adj2],
        },
      ];
    }, []);
};

export const one = (input: string): string => {
  const meta = getMeta(input);
  const partNumbers = getPartNumbers(meta);
  return partNumbers.reduce((acc, item) => +item.value + acc, 0).toString();
};

export const two = (input: string): string => {
  const meta = getMeta(input);
  const gears = getGears(meta);
  return gears
    .map(
      (gear) => +gear.adjacentValues[0].value * +gear.adjacentValues[1].value,
    )
    .reduce((acc, item) => acc + item, 0)
    .toString();
};

const partOne = async () => {
  const input = await fs.promises.readFile(`./inputs/day3/part1.txt`);
  return one(input.toString());
};
const partTwo = async () => {
  const input = await fs.promises.readFile(`./inputs/day3/part2.txt`);
  return two(input.toString());
};

export default { partOne, partTwo };
