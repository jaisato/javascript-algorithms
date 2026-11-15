/**
 * Return a fibonacci sequence as an array.
 *
 * @param n
 * @return {number[]}
 */
export default function fibonacci(n) {
  const fibSequence = [1];

  let currentValue = 1;
  let previousValue = 0;

  // The sequence of zero numbers is empty. Below 1 the counter used to start
  // negative, never reach zero and fill the array until memory ran out.
  if (n < 1) {
    return [];
  }

  if (n === 1) {
    return fibSequence;
  }

  let iterationsCounter = n - 1;

  while (iterationsCounter > 0) {
    currentValue += previousValue;
    previousValue = currentValue - previousValue;

    fibSequence.push(currentValue);

    iterationsCounter -= 1;
  }

  return fibSequence;
}
