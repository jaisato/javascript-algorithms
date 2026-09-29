/**
 * @param {number} number
 * @return bool
 */
export default function isPowerOfTwo(number) {
  // 0 & -1 is also 0, but zero is not a power of two (2^n > 0 for every n).
  return number > 0 && (number & (number - 1)) === 0;
}
