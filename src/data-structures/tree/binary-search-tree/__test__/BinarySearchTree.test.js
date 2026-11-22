import BinarySearchTree from '../BinarySearchTree';

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
});
