import AvlTree from '../AvlTree';

/**
 * Walks the whole tree and returns its values in order, failing the test if a
 * parent link, the search order or an AVL balance factor is wrong.
 *
 * @param {AvlTree} tree
 * @return {number[]}
 */
function checkAvlTree(tree) {
  const values = [];
  const problems = [];

  // Returns the height of the subtree (0 for an empty one).
  const walk = (node, parent, min, max) => {
    if (!node || node.value === null) {
      return 0;
    }

    if (node.parent !== parent) problems.push(`wrong parent at ${node.value}`);
    if ((min !== null && node.value <= min) || (max !== null && node.value >= max)) {
      problems.push(`out of order at ${node.value}`);
    }

    const leftHeight = walk(node.left, node, min, node.value);
    values.push(node.value);
    const rightHeight = walk(node.right, node, node.value, max);

    if (Math.abs(leftHeight - rightHeight) > 1) problems.push(`unbalanced at ${node.value}`);

    return Math.max(leftHeight, rightHeight) + 1;
  };

  walk(tree.root, null, null, null);
  expect(problems).toEqual([]);

  return values;
}

describe('AvlTree', () => {
  it('should do simple left-left rotation', () => {
    const tree = new AvlTree();

    tree.insert(4);
    tree.insert(3);
    tree.insert(2);

    expect(tree.toString()).toBe('2,3,4');
    expect(tree.root.value).toBe(3);
    expect(tree.root.height).toBe(1);

    tree.insert(1);

    expect(tree.toString()).toBe('1,2,3,4');
    expect(tree.root.value).toBe(3);
    expect(tree.root.height).toBe(2);

    tree.insert(0);

    expect(tree.toString()).toBe('0,1,2,3,4');
    expect(tree.root.value).toBe(3);
    expect(tree.root.left.value).toBe(1);
    expect(tree.root.height).toBe(2);
  });

  it('should do complex left-left rotation', () => {
    const tree = new AvlTree();

    tree.insert(30);
    tree.insert(20);
    tree.insert(40);
    tree.insert(10);

    expect(tree.root.value).toBe(30);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('10,20,30,40');

    tree.insert(25);
    expect(tree.root.value).toBe(30);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('10,20,25,30,40');

    tree.insert(5);
    expect(tree.root.value).toBe(20);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('5,10,20,25,30,40');
  });

  it('should do simple right-right rotation', () => {
    const tree = new AvlTree();

    tree.insert(2);
    tree.insert(3);
    tree.insert(4);

    expect(tree.toString()).toBe('2,3,4');
    expect(tree.root.value).toBe(3);
    expect(tree.root.height).toBe(1);

    tree.insert(5);

    expect(tree.toString()).toBe('2,3,4,5');
    expect(tree.root.value).toBe(3);
    expect(tree.root.height).toBe(2);

    tree.insert(6);

    expect(tree.toString()).toBe('2,3,4,5,6');
    expect(tree.root.value).toBe(3);
    expect(tree.root.right.value).toBe(5);
    expect(tree.root.height).toBe(2);
  });

  it('should do complex right-right rotation', () => {
    const tree = new AvlTree();

    tree.insert(30);
    tree.insert(20);
    tree.insert(40);
    tree.insert(50);

    expect(tree.root.value).toBe(30);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('20,30,40,50');

    tree.insert(35);
    expect(tree.root.value).toBe(30);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('20,30,35,40,50');

    tree.insert(55);
    expect(tree.root.value).toBe(40);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('20,30,35,40,50,55');
  });

  it('should do left-right rotation', () => {
    const tree = new AvlTree();

    tree.insert(30);
    tree.insert(20);
    tree.insert(25);

    expect(tree.root.height).toBe(1);
    expect(tree.root.value).toBe(25);
    expect(tree.toString()).toBe('20,25,30');
  });

  it('should do right-left rotation', () => {
    const tree = new AvlTree();

    tree.insert(30);
    tree.insert(40);
    tree.insert(35);

    expect(tree.root.height).toBe(1);
    expect(tree.root.value).toBe(35);
    expect(tree.toString()).toBe('30,35,40');
  });

  it('should create balanced tree: case #1', () => {
    // @see: https://www.youtube.com/watch?v=rbg7Qf8GkQ4&t=839s
    const tree = new AvlTree();

    tree.insert(1);
    tree.insert(2);
    tree.insert(3);

    expect(tree.root.value).toBe(2);
    expect(tree.root.height).toBe(1);
    expect(tree.toString()).toBe('1,2,3');

    tree.insert(6);

    expect(tree.root.value).toBe(2);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('1,2,3,6');

    tree.insert(15);

    expect(tree.root.value).toBe(2);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('1,2,3,6,15');

    tree.insert(-2);

    expect(tree.root.value).toBe(2);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('-2,1,2,3,6,15');

    tree.insert(-5);

    expect(tree.root.value).toBe(2);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('-5,-2,1,2,3,6,15');

    tree.insert(-8);

    expect(tree.root.value).toBe(2);
    expect(tree.root.height).toBe(3);
    expect(tree.toString()).toBe('-8,-5,-2,1,2,3,6,15');
  });

  it('should create balanced tree: case #2', () => {
    // @see https://www.youtube.com/watch?v=7m94k2Qhg68
    const tree = new AvlTree();

    tree.insert(43);
    tree.insert(18);
    tree.insert(22);
    tree.insert(9);
    tree.insert(21);
    tree.insert(6);

    expect(tree.root.value).toBe(18);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('6,9,18,21,22,43');

    tree.insert(8);

    expect(tree.root.value).toBe(18);
    expect(tree.root.height).toBe(2);
    expect(tree.toString()).toBe('6,8,9,18,21,22,43');
  });

  it('should do left right rotation and keeping left right node safe', () => {
    const tree = new AvlTree();

    tree.insert(30);
    tree.insert(15);
    tree.insert(40);
    tree.insert(10);
    tree.insert(18);
    tree.insert(35);
    tree.insert(45);
    tree.insert(5);
    tree.insert(12);

    expect(tree.toString()).toBe('5,10,12,15,18,30,35,40,45');
    expect(tree.root.height).toBe(3);

    tree.insert(11);

    expect(tree.toString()).toBe('5,10,11,12,15,18,30,35,40,45');
    expect(tree.root.height).toBe(3);
  });

  it('should do left right rotation and keeping left right node safe', () => {
    const tree = new AvlTree();

    tree.insert(30);
    tree.insert(15);
    tree.insert(40);
    tree.insert(10);
    tree.insert(18);
    tree.insert(35);
    tree.insert(45);
    tree.insert(42);
    tree.insert(47);

    expect(tree.toString()).toBe('10,15,18,30,35,40,42,45,47');
    expect(tree.root.height).toBe(3);

    tree.insert(43);

    expect(tree.toString()).toBe('10,15,18,30,35,40,42,43,45,47');
    expect(tree.root.height).toBe(3);
  });

  it('should remove values from the tree with right-right rotation', () => {
    const tree = new AvlTree();

    tree.insert(10);
    tree.insert(20);
    tree.insert(30);
    tree.insert(40);

    expect(tree.toString()).toBe('10,20,30,40');

    tree.remove(10);

    expect(tree.toString()).toBe('20,30,40');
    expect(tree.root.value).toBe(30);
    expect(tree.root.left.value).toBe(20);
    expect(tree.root.right.value).toBe(40);
    expect(tree.root.balanceFactor).toBe(0);
  });

  it('should remove values from the tree with left-left rotation', () => {
    const tree = new AvlTree();

    tree.insert(10);
    tree.insert(20);
    tree.insert(30);
    tree.insert(5);

    expect(tree.toString()).toBe('5,10,20,30');

    tree.remove(30);

    expect(tree.toString()).toBe('5,10,20');
    expect(tree.root.value).toBe(10);
    expect(tree.root.left.value).toBe(5);
    expect(tree.root.right.value).toBe(20);
    expect(tree.root.balanceFactor).toBe(0);
  });

  it('should keep balance after removal', () => {
    const tree = new AvlTree();

    tree.insert(1);
    tree.insert(2);
    tree.insert(3);
    tree.insert(4);
    tree.insert(5);
    tree.insert(6);
    tree.insert(7);
    tree.insert(8);
    tree.insert(9);

    expect(tree.toString()).toBe('1,2,3,4,5,6,7,8,9');
    expect(tree.root.value).toBe(4);
    expect(tree.root.height).toBe(3);
    expect(tree.root.balanceFactor).toBe(-1);

    tree.remove(8);

    expect(tree.root.value).toBe(4);
    expect(tree.root.balanceFactor).toBe(-1);

    tree.remove(9);

    expect(tree.contains(8)).toBeFalsy();
    expect(tree.contains(9)).toBeFalsy();
    expect(tree.toString()).toBe('1,2,3,4,5,6,7');
    expect(tree.root.value).toBe(4);
    expect(tree.root.height).toBe(2);
    expect(tree.root.balanceFactor).toBe(0);
  });

  it('should keep the rest of the tree when rotating a right child to the right', () => {
    const tree = new AvlTree();

    // 70 is a right child and gets left-heavy: the rotation used to put 60 on
    // the left of 50, dropping 40 and 30.
    [50, 40, 70, 30, 60, 55].forEach((value) => tree.insert(value));

    expect(tree.toString()).toBe('30,40,50,55,60,70');
    expect(tree.root.value).toBe(50);
    expect(tree.root.left.value).toBe(40);
    expect(tree.root.right.value).toBe(60);
    expect(checkAvlTree(tree)).toEqual([30, 40, 50, 55, 60, 70]);
  });

  it('should keep the rest of the tree when rotating a left child to the left', () => {
    const tree = new AvlTree();

    [50, 30, 70, 80, 40, 45].forEach((value) => tree.insert(value));

    expect(tree.toString()).toBe('30,40,45,50,70,80');
    expect(tree.root.value).toBe(50);
    expect(tree.root.left.value).toBe(40);
    expect(tree.root.right.value).toBe(70);
    expect(checkAvlTree(tree)).toEqual([30, 40, 45, 50, 70, 80]);
  });

  it('should rebalance inner nodes after removal', () => {
    const tree = new AvlTree();

    [1, 2, 3, 4, 5, 6, 7, 8].forEach((value) => tree.insert(value));

    // Removing 5 leaves 6 with only 7 -> 8 below it; the root stays balanced.
    tree.remove(5);

    expect(tree.toString()).toBe('1,2,3,4,6,7,8');
    expect(tree.root.value).toBe(4);
    expect(tree.root.right.value).toBe(7);
    expect(tree.root.right.left.value).toBe(6);
    expect(tree.root.right.right.value).toBe(8);
    expect(checkAvlTree(tree)).toEqual([1, 2, 3, 4, 6, 7, 8]);
  });

  it('should rotate after removal when the heavier child is balanced', () => {
    const tree = new AvlTree();

    [1, 2, 3, 4, 5].forEach((value) => tree.insert(value));

    // After removing 1 the root's right child (4) has balance factor 0.
    tree.remove(1);

    expect(tree.root.value).toBe(4);
    expect(tree.root.left.value).toBe(2);
    expect(tree.root.left.right.value).toBe(3);
    expect(tree.root.right.value).toBe(5);
    expect(checkAvlTree(tree)).toEqual([2, 3, 4, 5]);
  });

  it('should stay a valid AVL tree through a long run of inserts and removals', () => {
    const tree = new AvlTree();
    const expectedValues = new Set();

    // Small deterministic linear congruential generator.
    let seed = 42;
    const nextRandom = (limit) => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return Math.floor(seed / 65536) % limit;
    };

    for (let step = 0; step < 500; step += 1) {
      const value = nextRandom(60);

      if (expectedValues.has(value) && nextRandom(3) === 0) {
        expect(tree.remove(value)).toBe(true);
        expectedValues.delete(value);
      } else {
        tree.insert(value);
        expectedValues.add(value);
      }

      expect(checkAvlTree(tree)).toEqual([...expectedValues].sort((a, b) => a - b));
    }
  });
});
