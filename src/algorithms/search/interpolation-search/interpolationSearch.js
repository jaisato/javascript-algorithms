/**
 * Interpolation search implementation.
 *
 * @param {*[]} sortedArray - sorted array with uniformly distributed values
 * @param {*} seekElement
 * @return {number}
 */
export default function interpolationSearch(sortedArray, seekElement) {
  let leftIndex = 0;
  let rightIndex = sortedArray.length - 1;

  while (leftIndex <= rightIndex) {
    const rangeDelta = sortedArray[rightIndex] - sortedArray[leftIndex];
    const indexDelta = rightIndex - leftIndex;
    const valueDelta = seekElement - sortedArray[leftIndex];

    // If valueDelta is less then zero it means that there is no seek element
    // exists in array since the lowest element from the range is already higher
    // then seek element.
    if (valueDelta < 0) {
      return -1;
    }

    // Likewise, a seek element above the highest element of the range can't be
    // in it. Without this check the interpolated middleIndex lands past
    // rightIndex (even past the end of the array), the comparison against
    // `undefined` is false, rightIndex is reset to the same value and the loop
    // never terminates - e.g. searching 10 in [0, 1, 4, 4, 8, 8, 8].
    if (seekElement > sortedArray[rightIndex]) {
      return -1;
    }

    // If range delta is zero then subarray contains all the same numbers
    // and thus there is nothing to search for unless this range is all
    // consists of seek number.
    if (!rangeDelta) {
      // By doing this we're also avoiding division by zero while
      // calculating the middleIndex later.
      return sortedArray[leftIndex] === seekElement ? leftIndex : -1;
    }

    // Do interpolation of the middle index.
    const middleIndex = leftIndex + Math.floor((valueDelta * indexDelta) / rangeDelta);

    // If we've found the element just return its position.
    if (sortedArray[middleIndex] === seekElement) {
      return middleIndex;
    }

    // Decide which half to choose for seeking next: left or right one.
    if (sortedArray[middleIndex] < seekElement) {
      // Go to the right half of the array.
      leftIndex = middleIndex + 1;
    } else {
      // Go to the left half of the array.
      rightIndex = middleIndex - 1;
    }
  }

  return -1;
}
