/**
 * Return the number of bits used in the binary representation of the number.
 *
 * @param {number} number
 * @return {number}
 */
export default function bitLength(number) {
  let bitsCounter = 0;

  // 2 ** bitsCounter and not 1 << bitsCounter: shifts work on 32-bit
  // integers, so 1 << 31 is already negative and 1 << 32 is 1 again, and
  // the loop never ended for any number from 2^30 up.
  while ((2 ** bitsCounter) <= number) {
    bitsCounter += 1;
  }

  return bitsCounter;
}
