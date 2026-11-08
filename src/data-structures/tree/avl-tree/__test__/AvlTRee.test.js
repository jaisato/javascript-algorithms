import AvlTree from '../AvlTree';

/**
 * Checks the AVL invariants of a subtree: each child points back to its
 * parent and no node has one side more than one level taller than the other.
 */
function expectBalancedSubtree(node, parent = null) {
  if (!node) {
    return;
  }

  expect(node.parent).toBe(parent);
  expect(Math.abs(node.balanceFactor)).toBeLessThanOrEqual(1);

  expectBalancedSubtree(node.left, node);
  expectBalancedSubtree(node.right, node);
}

/**
 * A fixed shuffle of 1..size, so the test is the same on every run.
 */
function shuffledValues(size, seed) {
  const values = Array.from({ length: size }, (value, index) => index + 1);
  let state = seed;

  for (let index = size - 1; index > 0; index -= 1) {
    state = (state * 1103515245 + 12345) % 2147483648;
    const swapIndex = state % (index + 1);
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }

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

  it('should do left-left rotation under a right child', () => {
    const tree = new AvlTree();

    [10, 5, 20, 15, 12].forEach((value) => tree.insert(value));

    expect(tree.toString()).toBe('5,10,12,15,20');
    expect(tree.root.value).toBe(10);
    expect(tree.root.left.value).toBe(5);
    expect(tree.root.right.value).toBe(15);
    expect(tree.root.right.left.value).toBe(12);
    expect(tree.root.right.right.value).toBe(20);
    expectBalancedSubtree(tree.root);
  });

  it('should do right-right rotation under a left child', () => {
    const tree = new AvlTree();

    [20, 10, 30, 15, 18].forEach((value) => tree.insert(value));

    expect(tree.toString()).toBe('10,15,18,20,30');
    expect(tree.root.value).toBe(20);
    expect(tree.root.left.value).toBe(15);
    expect(tree.root.left.left.value).toBe(10);
    expect(tree.root.left.right.value).toBe(18);
    expect(tree.root.right.value).toBe(30);
    expectBalancedSubtree(tree.root);
  });

  it('should do left-right rotation under a right child', () => {
    const tree = new AvlTree();

    [10, 5, 20, 15, 17].forEach((value) => tree.insert(value));

    expect(tree.toString()).toBe('5,10,15,17,20');
    expect(tree.root.value).toBe(10);
    expect(tree.root.right.value).toBe(17);
    expect(tree.root.right.left.value).toBe(15);
    expect(tree.root.right.right.value).toBe(20);
    expectBalancedSubtree(tree.root);
  });

  it('should do right-left rotation under a left child', () => {
    const tree = new AvlTree();

    [20, 10, 30, 15, 12].forEach((value) => tree.insert(value));

    expect(tree.toString()).toBe('10,12,15,20,30');
    expect(tree.root.value).toBe(20);
    expect(tree.root.left.value).toBe(12);
    expect(tree.root.left.left.value).toBe(10);
    expect(tree.root.left.right.value).toBe(15);
    expectBalancedSubtree(tree.root);
  });

  it('should rebalance below the root after removal', () => {
    const tree = new AvlTree();

    [20, 10, 30, 5, 15, 25, 40, 50].forEach((value) => tree.insert(value));
    expectBalancedSubtree(tree.root);

    tree.remove(25);

    expect(tree.toString()).toBe('5,10,15,20,30,40,50');
    expect(tree.root.value).toBe(20);
    expect(tree.root.right.value).toBe(40);
    expect(tree.root.right.left.value).toBe(30);
    expect(tree.root.right.right.value).toBe(50);
    expectBalancedSubtree(tree.root);
  });

  it('should rotate after removal when the taller child is itself balanced', () => {
    const leftHeavyTree = new AvlTree();

    [20, 10, 30, 5, 15].forEach((value) => leftHeavyTree.insert(value));
    leftHeavyTree.remove(30);

    expect(leftHeavyTree.toString()).toBe('5,10,15,20');
    expect(leftHeavyTree.root.value).toBe(10);
    expect(leftHeavyTree.root.right.value).toBe(20);
    expect(leftHeavyTree.root.right.left.value).toBe(15);
    expectBalancedSubtree(leftHeavyTree.root);

    const rightHeavyTree = new AvlTree();

    [10, 5, 20, 15, 25].forEach((value) => rightHeavyTree.insert(value));
    rightHeavyTree.remove(5);

    expect(rightHeavyTree.toString()).toBe('10,15,20,25');
    expect(rightHeavyTree.root.value).toBe(20);
    expect(rightHeavyTree.root.left.value).toBe(10);
    expect(rightHeavyTree.root.left.right.value).toBe(15);
    expectBalancedSubtree(rightHeavyTree.root);
  });

  it('should not bring a removed value back on the next insertion', () => {
    const tree = new AvlTree();

    [10, 5, 20, 30].forEach((value) => tree.insert(value));
    tree.remove(20);
    tree.insert(40);

    expect(tree.contains(20)).toBe(false);
    expect(tree.toString()).toBe('5,10,30,40');
    expectBalancedSubtree(tree.root);
  });

  it('should stay balanced through many insertions and removals', () => {
    const tree = new AvlTree();
    const inserted = shuffledValues(64, 7);
    const removed = shuffledValues(64, 11).slice(0, 48);
    const remaining = new Set(inserted);

    inserted.forEach((value) => {
      tree.insert(value);
      expectBalancedSubtree(tree.root);
    });

    removed.forEach((value) => {
      tree.remove(value);
      remaining.delete(value);

      expect(tree.toString()).toBe([...remaining].sort((a, b) => a - b).join(','));
      expectBalancedSubtree(tree.root);
    });
  });
});
