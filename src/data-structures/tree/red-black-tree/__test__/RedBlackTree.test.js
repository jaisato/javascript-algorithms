import RedBlackTree from '../RedBlackTree';

/**
 * Lists every broken red-black rule in the tree, and every node whose parent
 * pointer does not point to the node it hangs from.
 *
 * @param {RedBlackTree} tree
 * @return {string[]}
 */
function findViolations(tree) {
  const violations = [];

  const visit = (node, parent) => {
    if (!node) {
      return 1;
    }

    if (node.parent !== parent) {
      violations.push(`${node.value} has a wrong parent`);
    }

    if (
      tree.isNodeRed(node)
      && [node.left, node.right].some((child) => child && tree.isNodeRed(child))
    ) {
      violations.push(`${node.value} is red with a red child`);
    }

    const leftBlackHeight = visit(node.left, node);
    const rightBlackHeight = visit(node.right, node);

    if (leftBlackHeight !== rightBlackHeight) {
      violations.push(`${node.value} has unequal black heights`);
    }

    return leftBlackHeight + (tree.isNodeBlack(node) ? 1 : 0);
  };

  if (!tree.isNodeBlack(tree.root)) {
    violations.push('the root is not black');
  }

  visit(tree.root, null);

  return violations;
}

describe('RedBlackTree', () => {
  it('should always color first inserted node as black', () => {
    const tree = new RedBlackTree();

    const firstInsertedNode = tree.insert(10);

    expect(tree.isNodeColored(firstInsertedNode)).toBe(true);
    expect(tree.isNodeBlack(firstInsertedNode)).toBe(true);
    expect(tree.isNodeRed(firstInsertedNode)).toBe(false);

    expect(tree.toString()).toBe('10');
    expect(tree.root.height).toBe(0);
  });

  it('should always color new leaf node as red', () => {
    const tree = new RedBlackTree();

    const firstInsertedNode = tree.insert(10);
    const secondInsertedNode = tree.insert(15);
    const thirdInsertedNode = tree.insert(5);

    expect(tree.isNodeBlack(firstInsertedNode)).toBe(true);
    expect(tree.isNodeRed(secondInsertedNode)).toBe(true);
    expect(tree.isNodeRed(thirdInsertedNode)).toBe(true);

    expect(tree.toString()).toBe('5,10,15');
    expect(tree.root.height).toBe(1);
  });

  it('should balance itself', () => {
    const tree = new RedBlackTree();

    tree.insert(5);
    tree.insert(10);
    tree.insert(15);
    tree.insert(20);
    tree.insert(25);
    tree.insert(30);

    expect(tree.toString()).toBe('5,10,15,20,25,30');
    expect(tree.root.height).toBe(3);
  });

  it('should balance itself when parent is black', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);

    expect(tree.isNodeBlack(node1)).toBe(true);

    const node2 = tree.insert(-10);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeRed(node2)).toBe(true);

    const node3 = tree.insert(20);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeRed(node2)).toBe(true);
    expect(tree.isNodeRed(node3)).toBe(true);

    const node4 = tree.insert(-20);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeBlack(node2)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
    expect(tree.isNodeRed(node4)).toBe(true);

    const node5 = tree.insert(25);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeBlack(node2)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
    expect(tree.isNodeRed(node4)).toBe(true);
    expect(tree.isNodeRed(node5)).toBe(true);

    const node6 = tree.insert(6);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeBlack(node2)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
    expect(tree.isNodeRed(node4)).toBe(true);
    expect(tree.isNodeRed(node5)).toBe(true);
    expect(tree.isNodeRed(node6)).toBe(true);

    expect(tree.toString()).toBe('-20,-10,6,10,20,25');
    expect(tree.root.height).toBe(2);

    const node7 = tree.insert(4);

    expect(tree.root.left.value).toEqual(node2.value);

    expect(tree.toString()).toBe('-20,-10,4,6,10,20,25');
    expect(tree.root.height).toBe(3);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeRed(node2)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
    expect(tree.isNodeBlack(node4)).toBe(true);
    expect(tree.isNodeBlack(node4)).toBe(true);
    expect(tree.isNodeRed(node5)).toBe(true);
    expect(tree.isNodeBlack(node6)).toBe(true);
    expect(tree.isNodeRed(node7)).toBe(true);
  });

  it('should balance itself when uncle is red', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(-20);
    const node5 = tree.insert(6);
    const node6 = tree.insert(15);
    const node7 = tree.insert(25);
    const node8 = tree.insert(2);
    const node9 = tree.insert(8);

    expect(tree.toString()).toBe('-20,-10,2,6,8,10,15,20,25');
    expect(tree.root.height).toBe(3);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeRed(node2)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
    expect(tree.isNodeBlack(node4)).toBe(true);
    expect(tree.isNodeBlack(node5)).toBe(true);
    expect(tree.isNodeRed(node6)).toBe(true);
    expect(tree.isNodeRed(node7)).toBe(true);
    expect(tree.isNodeRed(node8)).toBe(true);
    expect(tree.isNodeRed(node9)).toBe(true);

    const node10 = tree.insert(4);

    expect(tree.toString()).toBe('-20,-10,2,4,6,8,10,15,20,25');
    expect(tree.root.height).toBe(3);

    expect(tree.root.value).toBe(node5.value);

    expect(tree.isNodeBlack(node5)).toBe(true);
    expect(tree.isNodeRed(node1)).toBe(true);
    expect(tree.isNodeRed(node2)).toBe(true);
    expect(tree.isNodeRed(node10)).toBe(true);
    expect(tree.isNodeRed(node6)).toBe(true);
    expect(tree.isNodeRed(node7)).toBe(true);
    expect(tree.isNodeBlack(node4)).toBe(true);
    expect(tree.isNodeBlack(node8)).toBe(true);
    expect(tree.isNodeBlack(node9)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
  });

  it('should do left-left rotation', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(7);
    const node5 = tree.insert(15);

    expect(tree.toString()).toBe('-10,7,10,15,20');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeBlack(node2)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
    expect(tree.isNodeRed(node4)).toBe(true);
    expect(tree.isNodeRed(node5)).toBe(true);

    const node6 = tree.insert(13);

    expect(tree.toString()).toBe('-10,7,10,13,15,20');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeBlack(node2)).toBe(true);
    expect(tree.isNodeBlack(node5)).toBe(true);
    expect(tree.isNodeRed(node4)).toBe(true);
    expect(tree.isNodeRed(node6)).toBe(true);
    expect(tree.isNodeRed(node3)).toBe(true);
  });

  it('should do left-right rotation', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(7);
    const node5 = tree.insert(15);

    expect(tree.toString()).toBe('-10,7,10,15,20');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeBlack(node2)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
    expect(tree.isNodeRed(node4)).toBe(true);
    expect(tree.isNodeRed(node5)).toBe(true);

    const node6 = tree.insert(17);

    expect(tree.toString()).toBe('-10,7,10,15,17,20');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeBlack(node2)).toBe(true);
    expect(tree.isNodeBlack(node6)).toBe(true);
    expect(tree.isNodeRed(node4)).toBe(true);
    expect(tree.isNodeRed(node5)).toBe(true);
    expect(tree.isNodeRed(node3)).toBe(true);
  });

  it('should do recoloring, left-left and left-right rotation', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(-20);
    const node5 = tree.insert(6);
    const node6 = tree.insert(15);
    const node7 = tree.insert(30);
    const node8 = tree.insert(1);
    const node9 = tree.insert(9);

    expect(tree.toString()).toBe('-20,-10,1,6,9,10,15,20,30');
    expect(tree.root.height).toBe(3);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeRed(node2)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
    expect(tree.isNodeBlack(node4)).toBe(true);
    expect(tree.isNodeBlack(node5)).toBe(true);
    expect(tree.isNodeRed(node6)).toBe(true);
    expect(tree.isNodeRed(node7)).toBe(true);
    expect(tree.isNodeRed(node8)).toBe(true);
    expect(tree.isNodeRed(node9)).toBe(true);

    tree.insert(4);

    expect(tree.toString()).toBe('-20,-10,1,4,6,9,10,15,20,30');
    expect(tree.root.height).toBe(3);
  });

  it('should do right-left rotation', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(-20);
    const node5 = tree.insert(6);
    const node6 = tree.insert(30);

    expect(tree.toString()).toBe('-20,-10,6,10,20,30');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeBlack(node2)).toBe(true);
    expect(tree.isNodeBlack(node3)).toBe(true);
    expect(tree.isNodeRed(node4)).toBe(true);
    expect(tree.isNodeRed(node5)).toBe(true);
    expect(tree.isNodeRed(node6)).toBe(true);

    const node7 = tree.insert(25);

    const rightNode = tree.root.right;
    const rightLeftNode = rightNode.left;
    const rightRightNode = rightNode.right;

    expect(rightNode.value).toBe(node7.value);
    expect(rightLeftNode.value).toBe(node3.value);
    expect(rightRightNode.value).toBe(node6.value);

    expect(tree.toString()).toBe('-20,-10,6,10,20,25,30');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBe(true);
    expect(tree.isNodeBlack(node2)).toBe(true);
    expect(tree.isNodeBlack(node7)).toBe(true);
    expect(tree.isNodeRed(node4)).toBe(true);
    expect(tree.isNodeRed(node5)).toBe(true);
    expect(tree.isNodeRed(node3)).toBe(true);
    expect(tree.isNodeRed(node6)).toBe(true);
  });

  it('should do left-left rotation with left grand-parent', () => {
    const tree = new RedBlackTree();

    tree.insert(20);
    tree.insert(15);
    tree.insert(25);
    tree.insert(10);
    tree.insert(5);

    expect(tree.toString()).toBe('5,10,15,20,25');
    expect(tree.root.height).toBe(2);
  });

  it('should do right-right rotation with left grand-parent', () => {
    const tree = new RedBlackTree();

    tree.insert(20);
    tree.insert(15);
    tree.insert(25);
    tree.insert(17);
    tree.insert(19);

    expect(tree.toString()).toBe('15,17,19,20,25');
    expect(tree.root.height).toBe(2);
  });

  it('should throw an error when trying to remove node', () => {
    const removeNodeFromRedBlackTree = () => {
      const tree = new RedBlackTree();

      tree.remove(1);
    };

    expect(removeNodeFromRedBlackTree).toThrow();
  });

  it('should keep parent pointers right after rotations below the root', () => {
    const tree = new RedBlackTree();

    // The rotations for 5, 7 and 9 happen under the root and used to leave
    // the rotated grand parent (3, 5 and 7) with no parent.
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((value) => {
      tree.insert(value);
      expect(findViolations(tree)).toEqual([]);
    });

    expect(tree.toString()).toBe('1,2,3,4,5,6,7,8,9');
  });

  it('should not recolor a node when its value is inserted again', () => {
    const tree = new RedBlackTree();

    tree.insert(10);
    const node5 = tree.insert(5);
    tree.insert(15);
    tree.insert(1);

    expect(tree.isNodeBlack(node5)).toBe(true);

    expect(tree.insert(5)).toBe(node5);

    expect(tree.isNodeBlack(node5)).toBe(true);
    expect(findViolations(tree)).toEqual([]);
    expect(tree.toString()).toBe('1,5,10,15');
  });

  it('should keep the red-black rules for any insertion order', () => {
    const tree = new RedBlackTree();
    const values = [];

    // A fixed permutation of 0..96, so that every rotation and recoloring
    // case shows up on the left and on the right of the root. It used to
    // throw a TypeError at the 32nd value.
    for (let index = 0; index < 97; index += 1) {
      values.push((index * 37) % 97);
    }

    values.forEach((value) => {
      tree.insert(value);
      expect(findViolations(tree)).toEqual([]);
    });

    expect(tree.toString()).toBe([...values].sort((a, b) => a - b).toString());
    expect(tree.root.height).toBeLessThanOrEqual(2 * Math.log2(values.length + 1));
  });
});
