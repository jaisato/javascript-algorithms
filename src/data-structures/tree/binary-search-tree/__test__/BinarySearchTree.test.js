import BinarySearchTree from '../BinarySearchTree';

/**
 * Walks the whole tree and returns its values in order, failing the test if a
 * parent link or the search order is wrong.
 *
 * @param {BinarySearchTree} bst
 * @return {number[]}
 */
function checkBinarySearchTree(bst) {
  const values = [];
  const problems = [];

  const walk = (node, parent, min, max) => {
    if (!node || node.value === null) {
      return;
    }

    if (node.parent !== parent) problems.push(`wrong parent at ${node.value}`);
    if ((min !== null && node.value <= min) || (max !== null && node.value >= max)) {
      problems.push(`out of order at ${node.value}`);
    }

    walk(node.left, node, min, node.value);
    values.push(node.value);
    walk(node.right, node, node.value, max);
  };

  walk(bst.root, null, null, null);
  expect(problems).toEqual([]);

  return values;
}

describe('BinarySearchTree', () => {
  it('should create binary search tree', () => {
    const bst = new BinarySearchTree();

    expect(bst).toBeDefined();
    expect(bst.root).toBeDefined();
    expect(bst.root.value).toBeNull();
    expect(bst.root.left).toBeNull();
    expect(bst.root.right).toBeNull();
  });

  it('should insert values', () => {
    const bst = new BinarySearchTree();

    const insertedNode1 = bst.insert(10);
    const insertedNode2 = bst.insert(20);
    bst.insert(5);

    expect(bst.toString()).toBe('5,10,20');
    expect(insertedNode1.value).toBe(10);
    expect(insertedNode2.value).toBe(20);
  });

  it('should check if value exists', () => {
    const bst = new BinarySearchTree();

    bst.insert(10);
    bst.insert(20);
    bst.insert(5);

    expect(bst.contains(20)).toBe(true);
    expect(bst.contains(40)).toBe(false);
  });

  it('should remove nodes', () => {
    const bst = new BinarySearchTree();

    bst.insert(10);
    bst.insert(20);
    bst.insert(5);

    expect(bst.toString()).toBe('5,10,20');

    const removed1 = bst.remove(5);
    expect(bst.toString()).toBe('10,20');
    expect(removed1).toBe(true);

    const removed2 = bst.remove(20);
    expect(bst.toString()).toBe('10');
    expect(removed2).toBe(true);
  });

  it('should insert object values', () => {
    const nodeValueCompareFunction = (a, b) => {
      const normalizedA = a || { value: null };
      const normalizedB = b || { value: null };

      if (normalizedA.value === normalizedB.value) {
        return 0;
      }

      return normalizedA.value < normalizedB.value ? -1 : 1;
    };

    const obj1 = { key: 'obj1', value: 1, toString: () => 'obj1' };
    const obj2 = { key: 'obj2', value: 2, toString: () => 'obj2' };
    const obj3 = { key: 'obj3', value: 3, toString: () => 'obj3' };

    const bst = new BinarySearchTree(nodeValueCompareFunction);

    bst.insert(obj2);
    bst.insert(obj3);
    bst.insert(obj1);

    expect(bst.toString()).toBe('obj1,obj2,obj3');
  });

  it('should be traversed to sorted array', () => {
    const bst = new BinarySearchTree();

    bst.insert(10);
    bst.insert(-10);
    bst.insert(20);
    bst.insert(-20);
    bst.insert(25);
    bst.insert(6);

    expect(bst.toString()).toBe('-20,-10,6,10,20,25');
    expect(bst.root.height).toBe(2);

    bst.insert(4);

    expect(bst.toString()).toBe('-20,-10,4,6,10,20,25');
    expect(bst.root.height).toBe(3);
  });

  it('should really remove a node that moved up after its parent was removed', () => {
    const bst = new BinarySearchTree();

    bst.insert(10);
    bst.insert(5);
    bst.insert(3);

    bst.remove(5);

    expect(bst.toString()).toBe('3,10');
    expect(bst.root.left.value).toBe(3);
    expect(bst.root.left.parent).toBe(bst.root);

    bst.remove(3);

    expect(bst.toString()).toBe('10');
    expect(bst.contains(3)).toBe(false);
  });

  it('should keep the parent of a node with two children that is removed in place', () => {
    const bst = new BinarySearchTree();

    bst.insert(10);
    bst.insert(5);
    bst.insert(20);
    bst.insert(3);
    bst.insert(7);

    bst.remove(5);

    expect(bst.toString()).toBe('3,7,10,20');
    expect(bst.root.left.value).toBe(7);
    expect(bst.root.left.parent).toBe(bst.root);

    bst.remove(7);

    expect(bst.toString()).toBe('3,10,20');
    expect(bst.root.left.value).toBe(3);
    expect(bst.root.left.parent).toBe(bst.root);
  });

  it('should accept new values after the last one is removed', () => {
    const bst = new BinarySearchTree();

    bst.insert(1);
    bst.remove(1);

    expect(bst.toString()).toBe('');

    bst.insert(2);

    expect(bst.toString()).toBe('2');
    expect(bst.root.value).toBe(2);
    expect(bst.contains(2)).toBe(true);
  });

  it('should keep order and parent links through a long run of inserts and removals', () => {
    const bst = new BinarySearchTree();
    const expectedValues = new Set();

    // Small deterministic linear congruential generator. With this seed the
    // removals go through every branch of remove(): leaves, nodes with one
    // child, nodes with two children (successor right below or deeper), and
    // the root as a leaf, with one child and with two children.
    let seed = 161;
    const nextRandom = (limit) => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return Math.floor(seed / 65536) % limit;
    };

    for (let step = 0; step < 500; step += 1) {
      const value = nextRandom(40);

      if (expectedValues.has(value) && nextRandom(2) === 0) {
        expect(bst.remove(value)).toBe(true);
        expectedValues.delete(value);
      } else {
        bst.insert(value);
        expectedValues.add(value);
      }

      expect(checkBinarySearchTree(bst)).toEqual([...expectedValues].sort((a, b) => a - b));
      expect(bst.contains(value)).toBe(expectedValues.has(value));
    }
  });
});
