import Knapsack from '../Knapsack';
import KnapsackItem from '../KnapsackItem';

describe('Knapsack', () => {
  it('should solve 0/1 knapsack problem', () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 1, weight: 1 }),
      new KnapsackItem({ value: 4, weight: 3 }),
      new KnapsackItem({ value: 5, weight: 4 }),
      new KnapsackItem({ value: 7, weight: 5 }),
    ];

    const maxKnapsackWeight = 7;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveZeroOneKnapsackProblem();

    expect(knapsack.totalValue).toBe(9);
    expect(knapsack.totalWeight).toBe(7);
    expect(knapsack.selectedItems.length).toBe(2);
    expect(knapsack.selectedItems[0].toString()).toBe('v5 w4 x 1');
    expect(knapsack.selectedItems[1].toString()).toBe('v4 w3 x 1');
  });

  it('should solve 0/1 knapsack problem regardless of items order', () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 5, weight: 4 }),
      new KnapsackItem({ value: 1, weight: 1 }),
      new KnapsackItem({ value: 7, weight: 5 }),
      new KnapsackItem({ value: 4, weight: 3 }),
    ];

    const maxKnapsackWeight = 7;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveZeroOneKnapsackProblem();

    expect(knapsack.totalValue).toBe(9);
    expect(knapsack.totalWeight).toBe(7);
    expect(knapsack.selectedItems.length).toBe(2);
    expect(knapsack.selectedItems[0].toString()).toBe('v5 w4 x 1');
    expect(knapsack.selectedItems[1].toString()).toBe('v4 w3 x 1');
  });

  it('should solve 0/1 knapsack problem with impossible items set', () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 5, weight: 40 }),
      new KnapsackItem({ value: 1, weight: 10 }),
      new KnapsackItem({ value: 7, weight: 50 }),
      new KnapsackItem({ value: 4, weight: 30 }),
    ];

    const maxKnapsackWeight = 7;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveZeroOneKnapsackProblem();

    expect(knapsack.totalValue).toBe(0);
    expect(knapsack.totalWeight).toBe(0);
    expect(knapsack.selectedItems.length).toBe(0);
  });

  it('should solve 0/1 knapsack problem with all equal weights', () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 5, weight: 1 }),
      new KnapsackItem({ value: 1, weight: 1 }),
      new KnapsackItem({ value: 7, weight: 1 }),
      new KnapsackItem({ value: 4, weight: 1 }),
      new KnapsackItem({ value: 4, weight: 1 }),
      new KnapsackItem({ value: 4, weight: 1 }),
    ];

    const maxKnapsackWeight = 3;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveZeroOneKnapsackProblem();

    expect(knapsack.totalValue).toBe(16);
    expect(knapsack.totalWeight).toBe(3);
    expect(knapsack.selectedItems.length).toBe(3);
    expect(knapsack.selectedItems[0].toString()).toBe('v4 w1 x 1');
    expect(knapsack.selectedItems[1].toString()).toBe('v5 w1 x 1');
    expect(knapsack.selectedItems[2].toString()).toBe('v7 w1 x 1');
  });

  it('should solve 0/1 knapsack problem with items of different weights', () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 10, weight: 5 }),
      new KnapsackItem({ value: 40, weight: 4 }),
      new KnapsackItem({ value: 30, weight: 6 }),
      new KnapsackItem({ value: 50, weight: 3 }),
    ];

    const knapsack = new Knapsack(possibleKnapsackItems, 10);

    knapsack.solveZeroOneKnapsackProblem();

    expect(knapsack.totalValue).toBe(90);
    expect(knapsack.totalWeight).toBe(7);
    expect(knapsack.selectedItems.map((item) => item.toString())).toEqual([
      'v40 w4 x 1',
      'v50 w3 x 1',
    ]);
  });

  it('should take every item into account when choosing them', () => {
    // A single item used to be left out: the first (lightest) item was never
    // considered while tracing the choice back.
    const singleItemKnapsack = new Knapsack([new KnapsackItem({ value: 3, weight: 1 })], 7);
    singleItemKnapsack.solveZeroOneKnapsackProblem();
    expect(singleItemKnapsack.totalValue).toBe(3);
    expect(singleItemKnapsack.selectedItems.length).toBe(1);

    // All four fit, for a value of 1 + 7 + 3 + 3 = 14; it used to give 13.
    const allFitKnapsack = new Knapsack([
      new KnapsackItem({ value: 1, weight: 1 }),
      new KnapsackItem({ value: 7, weight: 1 }),
      new KnapsackItem({ value: 3, weight: 1 }),
      new KnapsackItem({ value: 3, weight: 1 }),
    ], 4);
    allFitKnapsack.solveZeroOneKnapsackProblem();
    expect(allFitKnapsack.totalValue).toBe(14);
    expect(allFitKnapsack.totalWeight).toBe(4);

    // This one used to throw a TypeError (it read the row before the first).
    const oneSlotKnapsack = new Knapsack([
      new KnapsackItem({ value: 9, weight: 1 }),
      new KnapsackItem({ value: 9, weight: 1 }),
      new KnapsackItem({ value: 7, weight: 1 }),
    ], 1);
    oneSlotKnapsack.solveZeroOneKnapsackProblem();
    expect(oneSlotKnapsack.totalValue).toBe(9);
    expect(oneSlotKnapsack.selectedItems.length).toBe(1);

    const emptyKnapsack = new Knapsack([], 5);
    emptyKnapsack.solveZeroOneKnapsackProblem();
    expect(emptyKnapsack.totalValue).toBe(0);
    expect(emptyKnapsack.selectedItems).toEqual([]);
  });

  it('should solve unbound knapsack problem', () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 84, weight: 7 }), // v/w ratio is 12
      new KnapsackItem({ value: 5, weight: 2 }), // v/w ratio is 2.5
      new KnapsackItem({ value: 12, weight: 3 }), // v/w ratio is 4
      new KnapsackItem({ value: 10, weight: 1 }), // v/w ratio is 10
      new KnapsackItem({ value: 20, weight: 2 }), // v/w ratio is 10
    ];

    const maxKnapsackWeight = 15;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveUnboundedKnapsackProblem();

    expect(knapsack.totalValue).toBe(84 + 20 + 12 + 10 + 5);
    expect(knapsack.totalWeight).toBe(15);
    expect(knapsack.selectedItems.length).toBe(5);
    expect(knapsack.selectedItems[0].toString()).toBe('v84 w7 x 1');
    expect(knapsack.selectedItems[1].toString()).toBe('v20 w2 x 1');
    expect(knapsack.selectedItems[2].toString()).toBe('v10 w1 x 1');
    expect(knapsack.selectedItems[3].toString()).toBe('v12 w3 x 1');
    expect(knapsack.selectedItems[4].toString()).toBe('v5 w2 x 1');
  });

  it('should solve unbound knapsack problem with items in stock', () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 84, weight: 7, itemsInStock: 3 }), // v/w ratio is 12
      new KnapsackItem({ value: 5, weight: 2, itemsInStock: 2 }), // v/w ratio is 2.5
      new KnapsackItem({ value: 12, weight: 3, itemsInStock: 1 }), // v/w ratio is 4
      new KnapsackItem({ value: 10, weight: 1, itemsInStock: 6 }), // v/w ratio is 10
      new KnapsackItem({ value: 20, weight: 2, itemsInStock: 8 }), // v/w ratio is 10
    ];

    const maxKnapsackWeight = 17;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveUnboundedKnapsackProblem();

    expect(knapsack.totalValue).toBe(84 + 84 + 20 + 10);
    expect(knapsack.totalWeight).toBe(17);
    expect(knapsack.selectedItems.length).toBe(3);
    expect(knapsack.selectedItems[0].toString()).toBe('v84 w7 x 2');
    expect(knapsack.selectedItems[1].toString()).toBe('v20 w2 x 1');
    expect(knapsack.selectedItems[2].toString()).toBe('v10 w1 x 1');
  });

  it('should solve unbound knapsack problem with items in stock and max weight more than sum of all items', () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 84, weight: 7, itemsInStock: 3 }), // v/w ratio is 12
      new KnapsackItem({ value: 5, weight: 2, itemsInStock: 2 }), // v/w ratio is 2.5
      new KnapsackItem({ value: 12, weight: 3, itemsInStock: 1 }), // v/w ratio is 4
      new KnapsackItem({ value: 10, weight: 1, itemsInStock: 6 }), // v/w ratio is 10
      new KnapsackItem({ value: 20, weight: 2, itemsInStock: 8 }), // v/w ratio is 10
    ];

    const maxKnapsackWeight = 60;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveUnboundedKnapsackProblem();

    expect(knapsack.totalValue).toBe((3 * 84) + (2 * 5) + (1 * 12) + (6 * 10) + (8 * 20));
    expect(knapsack.totalWeight).toBe((3 * 7) + (2 * 2) + (1 * 3) + (6 * 1) + (8 * 2));
    expect(knapsack.selectedItems.length).toBe(5);
    expect(knapsack.selectedItems[0].toString()).toBe('v84 w7 x 3');
    expect(knapsack.selectedItems[1].toString()).toBe('v20 w2 x 8');
    expect(knapsack.selectedItems[2].toString()).toBe('v10 w1 x 6');
    expect(knapsack.selectedItems[3].toString()).toBe('v12 w3 x 1');
    expect(knapsack.selectedItems[4].toString()).toBe('v5 w2 x 2');
  });

  it('should not go over the weight limit in unbound knapsack problem', () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 100, weight: 6 }),
      new KnapsackItem({ value: 1, weight: 5 }),
    ];

    const knapsack = new Knapsack(possibleKnapsackItems, 10);

    // Once the first item is in, the second one does not fit any more: it used
    // to be added anyway, for a total weight of 11.
    knapsack.solveUnboundedKnapsackProblem();

    expect(knapsack.totalWeight).toBe(6);
    expect(knapsack.totalValue).toBe(100);
    expect(knapsack.selectedItems.map((item) => item.toString())).toEqual(['v100 w6 x 1']);
  });
});
