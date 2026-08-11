import { STATIONS, ALL_STATION_NAMES, calculateOptimalPath } from './src/lib/metro.ts';

console.log("Total stations:", ALL_STATION_NAMES.length);
let infiniteCount = 0;
for (let i = 0; i < ALL_STATION_NAMES.length; i++) {
  let a = ALL_STATION_NAMES[i];
  // check if a shares a line with ALL other stations
  let sharesWithAll = true;
  for (let j = 0; j < ALL_STATION_NAMES.length; j++) {
    let b = ALL_STATION_NAMES[j];
    if (a !== b && !STATIONS[a].some(l => STATIONS[b].includes(l))) {
      sharesWithAll = false;
      break;
    }
  }
  if (sharesWithAll) {
    console.log("Station shares with all:", a, STATIONS[a]);
  }
}
