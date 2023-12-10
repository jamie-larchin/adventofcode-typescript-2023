import fs from "fs";

type Range = [number, number];

type GardenRange = [Range, Range];

type GardenMap = { id: string; ranges: GardenRange[] };

const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

const getId = (input: string): string => {
  const [id] = input.split(" map");
  return id;
};

const getSeeds = (input: string): number[] => {
  const str = input.split(/\r?\n{2,}/)[0];
  const seedsStr = str.split(":")[1];
  return seedsStr.trim().split(" ").map(Number);
};

const getSeedRanges = (input: string): Range[] => {
  const str = input.split(/\r?\n{2,}/)[0];
  const seedsStr = str.split(":")[1];
  const list = seedsStr.trim().split(" ").map(Number);
  let index = 0;
  return new Array(list.length / 2).fill(0).map(() => {
    const start = list[index];
    const end = start + list[index + 1] - 1;
    index = index + 2;
    return [start, end];
  });
};

const getRange = (
  source: number,
  destination: number,
  range: number,
): GardenRange => {
  return [
    [source, source + range - 1],
    [destination, destination + range - 1],
  ];
};

const getRanges = (input: string): GardenRange[] => {
  const ranges = input
    .split(/\r?\n/)
    .map((item) => {
      const [destination, source, range] = item.split(" ");
      return getRange(+source, +destination, +range);
    })
    .sort();
  return ranges;
};

export const getMaps = (input: string): GardenMap[] => {
  return input
    .split(/\r?\n{2,}/)
    .slice(1)
    .map((str) => {
      const [descStr, metaStr] = str.split(":");
      const id = getId(descStr);
      const ranges = getRanges(metaStr.trim());
      return { id, ranges };
    });
};

const getMapRanges = (mapId: string, maps: GardenMap[]): GardenRange[] =>
  maps.find((map) => map.id === mapId)?.ranges ?? [];

const getMapValue = (
  mapId: string,
  sourceValue: number,
  maps: GardenMap[],
): number => {
  const ranges = getMapRanges(mapId, maps);
  const range = ranges.find(([source]) =>
    isInRange(sourceValue, source[0], source[1]),
  );
  if (!range) return sourceValue;
  const [[sourceMin], [destinationMin]] = range;
  const difference = sourceValue - sourceMin;
  return destinationMin + difference;
};

export const mapSourceToDestinationRanges = (
  sourceRange: Range,
  ranges: GardenRange[],
): Range[] => {
  return ranges.reduce((acc: Range[], [source, dest]) => {
    const isOutsideRange =
      sourceRange[1] < source[0] || sourceRange[0] > source[1];
    if (isOutsideRange) return acc;
    const sourceStart = Math.max(source[0], sourceRange[0]);
    const sourceEnd = Math.min(source[1], sourceRange[1]);
    const diff = sourceStart - source[0];
    const range = sourceEnd - sourceStart;
    const destStart = dest[0] + diff;
    const destEnd = destStart + range;
    return [...acc, [destStart, destEnd]];
  }, []);
};

const sortRanges = (a: GardenRange, b: GardenRange): number => {
  return a[0][0] - b[0][0];
};

const getFullSetOfRanges = (
  mapId: string,
  sourceRanges: Range[],
  maps: GardenMap[],
): GardenRange[] => {
  const ranges = getMapRanges(mapId, maps).sort(sortRanges);
  const maximum = Math.max(
    ...Array.from(new Set(sourceRanges.map(([, end]) => end))),
  );
  const firstRangeSourceStart = ranges.at(0)?.at(0)?.at(0) ?? 0;
  const lastRangeSourceEnd = ranges.at(-1)?.at(0)?.at(1) ?? maximum;
  if (firstRangeSourceStart > 0)
    ranges.push([
      [0, firstRangeSourceStart],
      [0, firstRangeSourceStart],
    ]);
  if (lastRangeSourceEnd < maximum)
    ranges.push([
      [lastRangeSourceEnd, maximum],
      [lastRangeSourceEnd, maximum],
    ]);
  return ranges;
};

const mapRanges = (
  mapId: string,
  sourceRanges: Range[],
  maps: GardenMap[],
): Range[] => {
  const ranges = getFullSetOfRanges(mapId, sourceRanges, maps);
  return sourceRanges.flatMap((sourceRange) => {
    return mapSourceToDestinationRanges(sourceRange, ranges);
  });
};

export const getSeedLocations = (
  seeds: number[],
  maps: GardenMap[],
): number[] => {
  return seeds.map((seed) => {
    const soil = getMapValue("seed-to-soil", seed, maps);
    const fertilizer = getMapValue("soil-to-fertilizer", soil, maps);
    const water = getMapValue("fertilizer-to-water", fertilizer, maps);
    const light = getMapValue("water-to-light", water, maps);
    const temperature = getMapValue("light-to-temperature", light, maps);
    const humidity = getMapValue("temperature-to-humidity", temperature, maps);
    const location = getMapValue("humidity-to-location", humidity, maps);
    return location;
  });
};

const getSeedLocationRanges = (
  seedRanges: Range[],
  maps: GardenMap[],
): Range[] => {
  return seedRanges.flatMap((seedRange) => {
    const soilRanges = mapRanges("seed-to-soil", [seedRange], maps);
    const fertilizerRanges = mapRanges("soil-to-fertilizer", soilRanges, maps);
    const waterRanges = mapRanges(
      "fertilizer-to-water",
      fertilizerRanges,
      maps,
    );
    const lightRanges = mapRanges("water-to-light", waterRanges, maps);
    const temperatureRanges = mapRanges(
      "light-to-temperature",
      lightRanges,
      maps,
    );
    const humidityRanges = mapRanges(
      "temperature-to-humidity",
      temperatureRanges,
      maps,
    );
    const locationRanges = mapRanges(
      "humidity-to-location",
      humidityRanges,
      maps,
    );
    return locationRanges;
  });
};

export const one = (input: string): string => {
  const seeds = getSeeds(input);
  const maps = getMaps(input);
  const locations = getSeedLocations(seeds, maps);
  return `${Math.min(...locations)}`;
};

export const two = (input: string): string => {
  const seedRanges = getSeedRanges(input);
  const maps = getMaps(input);
  const locationRangeStarts = Array.from(
    new Set(getSeedLocationRanges(seedRanges, maps).map(([start]) => start)),
  );
  return `${Math.min(...locationRangeStarts)}`;
};

const partOne = async () => {
  const input = await fs.promises.readFile(`./inputs/day5/part1.txt`);
  return one(input.toString());
};

const partTwo = async () => {
  const input = await fs.promises.readFile(`./inputs/day5/part2.txt`);
  return two(input.toString());
};

export default { partOne, partTwo };

// [ [ 79, 92 ], [ 55, 67 ] ] --> 79-92 (14) --> 82
// [ [ [ 98, 99 ], [ 50, 51 ] ], [ [ 50, 97 ], [ 52, 99 ] ] ] --> 82=84
// [ [ [ 15, 51 ], [ 0, 36 ] ], [ [ 52, 53 ], [ 37, 38 ] ], [ [ 0, 14 ], [ 39, 53 ] ] ] --> 84=84
// [ [ [ 53, 60 ], [ 49, 56 ] ], [ [ 11, 52 ], [ 0, 41 ] ], [ [ 0, 6 ], [ 42, 48 ] ], [ [ 7, 10 ], [ 57, 60 ] ] ] --> 84=84
// [ [ [ 18, 24 ], [ 88, 94 ] ], [ [ 25, 94 ], [ 18, 87 ] ] ] --> 84=77
// [ [ [ 77, 99 ], [ 45, 67 ] ], [ [ 45, 63 ], [ 81, 99 ] ], [ [ 64, 76 ], [ 68, 80 ] ] ] --> 77=45
// [ [ [ 69, 69 ], [ 0, 0 ] ], [ [ 0, 68 ], [ 1, 69 ] ] ] --> 45=46
// [ [ [ 56, 92 ], [ 60, 96 ] ], [ [ 93, 96 ], [ 56, 59 ] ] ] --> 46=46

// [ [ 79, 92 ], [ 55, 67 ] ] --> 79-92 (14)
// [ [ [ 98, 99 ], [ 50, 51 ] ], [ [ 50, 97 ], [ 52, 99 ] ] | [[0, 49]] ] --> 79-92=81-94
// [ [ [ 15, 51 ], [ 0, 36 ] ], [ [ 52, 53 ], [ 37, 38 ] ], [ [ 0, 14 ], [ 39, 53 ] ] | [[54, 92]] ] --> 81-94=81-94
// [ [ [ 53, 60 ], [ 49, 56 ] ], [ [ 11, 52 ], [ 0, 41 ] ], [ [ 0, 6 ], [ 42, 48 ] ], [ [ 7, 10 ], [ 57, 60 ] ] | [[61, 92]] ] --> 81-94
// [ [ [ 18, 24 ], [ 88, 94 ] ], [ [ 25, 94 ], [ 18, 87 ] ] | [0, 17] ] --> 81-94=74-87
// [ [ [ 77, 99 ], [ 45, 67 ] ], [ [ 45, 63 ], [ 81, 99 ] ], [ [ 64, 76 ], [ 68, 80 ] ] | [[0, 44]] ] --> 74-76=78-80, 77-87=45-55
// [ [ [ 69, 69 ], [ 0, 0 ] ], [ [ 0, 68 ], [ 1, 69 ] ] | [[70, 80]] ] --> 78-80=78-80, 45-55=46-56
// [ [ [ 56, 92 ], [ 60, 96 ] ], [ [ 93, 96 ], [ 56, 59 ] ] | [0, 55] ] --> 78-80=82-84, 46-55=46-55, 56=60 --> 46
