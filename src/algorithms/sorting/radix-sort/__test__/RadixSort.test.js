import RadixSort from '../RadixSort';
import { SortTester } from '../../SortTester';

// Complexity constants.
const ARRAY_OF_STRINGS_VISIT_COUNT = 24;
const ARRAY_OF_INTEGERS_VISIT_COUNT = 77;
describe('RadixSort', () => {
  it('should sort array', () => {
    SortTester.testSort(RadixSort);
  });

  it('should sort negative numbers', () => {
    SortTester.testNegativeNumbersSort(RadixSort);

    const sorter = new RadixSort();
    expect(sorter.sort([-2, -8, 4, -3, 0, -6, 3])).toEqual([-8, -6, -3, -2, 0, 3, 4]);
    expect(sorter.sort([-100, -5, -20, -1])).toEqual([-100, -20, -5, -1]);
    expect(sorter.sort([0, -1])).toEqual([-1, 0]);
  });

  it('should sort arrays of zeros and long arrays', () => {
    const sorter = new RadixSort();
    expect(sorter.sort([0, 0, 0])).toEqual([0, 0, 0]);

    const long = Array.from({ length: 200000 }, (_, i) => (i * 7919) % 200000);
    expect(sorter.sort(long)).toEqual([...long].sort((a, b) => a - b));
  });

  it('should visit array of strings n (number of strings) x m (length of longest element) times', () => {
    SortTester.testAlgorithmTimeComplexity(
      RadixSort,
      ['zzz', 'bb', 'a', 'rr', 'rrb', 'rrba'],
      ARRAY_OF_STRINGS_VISIT_COUNT,
    );
  });

  it('should visit array of integers n (number of elements) x m (length of longest integer) times', () => {
    SortTester.testAlgorithmTimeComplexity(
      RadixSort,
      [3, 1, 75, 32, 884, 523, 4343456, 232, 123, 656, 343],
      ARRAY_OF_INTEGERS_VISIT_COUNT,
    );
  });
});
