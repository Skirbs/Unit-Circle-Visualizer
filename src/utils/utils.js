function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function getClosestN(origNumber, numberList) {
  // Find the closest number in the "numberList" using "origNumber"
  let selectedNumber;

  for (const number of numberList) {
    if (!selectedNumber || Math.abs(origNumber - number) < Math.abs(origNumber - selectedNumber)) {
      selectedNumber = number;
    }
  }

  return selectedNumber;
}
export default {getDistance, getClosestN};
