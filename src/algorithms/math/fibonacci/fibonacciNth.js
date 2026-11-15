/**
 * Calculate fibonacci number at specific position using Dynamic Programming approach.
 *
 * @param n
 * @return {number}
 */
export default function fibonacciNth(n) {
  let currentValue = 1;
  let previousValue = 0;

  // F(0) is 0. Below 1 the counter used to start negative and the loop
  // never ended.
  if (n < 1) {
    return 0;
  }

  if (n === 1) {
    return 1;
  }

  let iterationsCounter = n - 1;

  while (iterationsCounter > 0) {
    currentValue += previousValue;
    previousValue = currentValue - previousValue;

    iterationsCounter -= 1;
  }

  return currentValue;
}
