const speeds = {
  spear: 18,
  sword: 22,
  axe: 18,
  spy: 9,
  light: 10,
  heavy: 11,
  ram: 30,
  catapult: 30,
  knight: 10,
  snob: 35,
};

function calculateDistance(x1, y1, x2, y2) {
  let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance;
}

function calculateTravelTime(x1, y1, x2, y2, units) {
  const slowestUnit = units.reduce((slowest, unit) => {
    if (speeds[unit] > speeds[slowest]) {
      return unit;
    }
    return slowest;
  }, units[0]);

  let distance = calculateDistance(x1, y1, x2, y2) * speeds[slowestUnit];

  return translateToTime(distance);
}

function translateToTime(value) {

  let hours = customRound(value / 60);
  let minutes = customRound(value % 60);
  let seconds = customRound((value % 1) * 60);

  return [hours, minutes, seconds];
}

function customRound(number) {
  if (number - Math.floor(number) >= 0.9) {
      return Math.ceil(number); // Round up
  } else {
      return Math.floor(number); // Round down
  }
}

function addZeroIsLessThanTen(value) {
  if (value < 10) {
    value = "0" + value;
  }

  return value;
}
