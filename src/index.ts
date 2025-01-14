import day0 from "./day0/index";
import day1 from "./day1/index";

type DayPart = () => Promise<string>;
type Day = {
  partOne: DayPart;
  partTwo: DayPart;
};

import day2 from "./day2/index";
import day3 from "./day3/index";
import day4 from "./day4/index";
import day5 from "./day5/index";
import day6 from "./day6/index";
import day7 from "./day7/index";
import day8 from "./day8/index";
// MORE IMPORTS HERE
const days: Day[] = [
  day0,
  day1,
  day2,
  day3,
  day4,
  day5,
  day6,
  day7,
  day8,
  day8,
  // MORE DAYS HERE
];

async function runDay(dayId: number) {
  const resultPart1 = await days[dayId].partOne();
  console.log("Part 1 result:\n");
  console.log(resultPart1);

  console.log("\n");

  const resultPart2 = await days[dayId].partTwo();
  console.log("Part 2 result:\n");
  console.log(resultPart2);
}

console.log("\n\n\n   ADVENT OF CODE \n\n");
const params = process.argv.splice(2);

if (params.length) {
  runDay(parseInt(params[0], 10));
} else {
  console.log(`Usage: npm run start [day]`);
}
