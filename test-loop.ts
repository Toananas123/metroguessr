import { STATIONS, ALL_STATION_NAMES } from './src/lib/metro.ts';

let infiniteCount = 0;
for (let i = 0; i < 1000; i++) {
  let a = ALL_STATION_NAMES[Math.floor(Math.random() * ALL_STATION_NAMES.length)];
  let b = ALL_STATION_NAMES[Math.floor(Math.random() * ALL_STATION_NAMES.length)];
  
  let attempts = 0;
  while (a === b || STATIONS[a].some(l => STATIONS[b].includes(l))) {
    b = ALL_STATION_NAMES[Math.floor(Math.random() * ALL_STATION_NAMES.length)];
    attempts++;
    if (attempts > 100) {
      infiniteCount++;
      break;
    }
  }
}
console.log("Infinite loops: ", infiniteCount);
