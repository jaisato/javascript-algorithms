/**
 * @param {number} originalNumber
 * @return {number}
 */
export default function countSetBits(originalNumber) {
  let setBitsCount = 0;
  let number = originalNumber;

  while (number) {
    // Add last bit of the number to the sum of set bits.
    setBitsCount += number & 1;

    // Shift number right by one bit to investigate other bits. The unsigned
    // shift fills with zeros: the signed one copies the sign bit, so a
    // negative number never reached zero and the loop never ended.
    number >>>= 1;
  }

  return setBitsCount;
}
