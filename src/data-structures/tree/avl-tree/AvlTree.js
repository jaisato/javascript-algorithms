import BinarySearchTree from '../binary-search-tree/BinarySearchTree';

export default class AvlTree extends BinarySearchTree {
  /**
   * @param {*} value
   */
  insert(value) {
    // Do the normal BST insert.
    super.insert(value);

    // Let's move up to the root and check balance factors along the way.
    let currentNode = this.root.find(value);
    while (currentNode) {
      this.balance(currentNode);
      currentNode = currentNode.parent;
    }
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value) {
    // The node the standard BST removal detaches: the one holding the value
    // or, when it has two children, the smallest node of its right subtree,
    // whose value moves up. Only the subtrees above it may get shorter, so
    // they are balanced from there up to the root, as insert() does.
    const nodeToRemove = this.root.find(value);
    const detachedNode = nodeToRemove && nodeToRemove.left && nodeToRemove.right
      ? nodeToRemove.right.findMin()
      : nodeToRemove;
    let currentNode = detachedNode ? detachedNode.parent : null;

    // Do standard BST removal.
    const removed = super.remove(value);

    while (currentNode) {
      this.balance(currentNode);
      currentNode = currentNode.parent;
    }

    return removed;
  }

  /**
   * @param {BinarySearchTreeNode} node
   */
  balance(node) {
    // If balance factor is not OK then try to balance the node.
    // After a removal the taller child may be balanced itself: a single
    // rotation fixes that case too.
    if (node.balanceFactor > 1) {
      // Left rotation.
      if (node.left.balanceFactor >= 0) {
        // Left-Left rotation
        this.rotateLeftLeft(node);
      } else {
        // Left-Right rotation.
        this.rotateLeftRight(node);
      }
    } else if (node.balanceFactor < -1) {
      // Right rotation.
      if (node.right.balanceFactor <= 0) {
        // Right-Right rotation
        this.rotateRightRight(node);
      } else {
        // Right-Left rotation.
        this.rotateRightLeft(node);
      }
    }
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateLeftLeft(rootNode) {
    const { parent } = rootNode;
    const leftNode = rootNode.left;
    const leftRightNode = leftNode.right;

    // Detach left node from root node, and left node's right subtree from it.
    rootNode.setLeft(null);
    leftNode.setRight(null);

    // Make left node take the place of root node, on the same side of the
    // parent root node hung from.
    if (parent) {
      parent.replaceChild(rootNode, leftNode);
    } else if (rootNode === this.root) {
      // If root node is root then make left node to be a new root.
      this.root = leftNode;
    }

    // The right subtree of left node becomes the left subtree of root node.
    rootNode.setLeft(leftRightNode);

    // Attach rootNode to the right of leftNode.
    leftNode.setRight(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateLeftRight(rootNode) {
    const leftNode = rootNode.left;
    const leftRightNode = leftNode.right;
    const leftRightLeftNode = leftRightNode.left;

    // Detach the nodes that move before attaching them anywhere else:
    // setLeft() and setRight() reset the parent of the node they replace.
    rootNode.setLeft(null);
    leftNode.setRight(null);
    leftRightNode.setLeft(null);

    // Preserve leftRightNode's left subtree.
    leftNode.setRight(leftRightLeftNode);

    // Attach leftNode as left node for leftRight node.
    leftRightNode.setLeft(leftNode);

    // Attach leftRightNode to the rootNode.
    rootNode.setLeft(leftRightNode);

    // Do left-left rotation.
    this.rotateLeftLeft(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateRightLeft(rootNode) {
    const rightNode = rootNode.right;
    const rightLeftNode = rightNode.left;
    const rightLeftRightNode = rightLeftNode.right;

    // Detach the nodes that move before attaching them anywhere else:
    // setLeft() and setRight() reset the parent of the node they replace.
    rootNode.setRight(null);
    rightNode.setLeft(null);
    rightLeftNode.setRight(null);

    // Preserve rightLeftNode's right subtree.
    rightNode.setLeft(rightLeftRightNode);

    // Attach rightNode as right node for rightLeft node.
    rightLeftNode.setRight(rightNode);

    // Attach rightLeftNode to the rootNode.
    rootNode.setRight(rightLeftNode);

    // Do right-right rotation.
    this.rotateRightRight(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateRightRight(rootNode) {
    const { parent } = rootNode;
    const rightNode = rootNode.right;
    const rightLeftNode = rightNode.left;

    // Detach right node from root node, and right node's left subtree from it.
    rootNode.setRight(null);
    rightNode.setLeft(null);

    // Make right node take the place of root node, on the same side of the
    // parent root node hung from.
    if (parent) {
      parent.replaceChild(rootNode, rightNode);
    } else if (rootNode === this.root) {
      // If root node is root then make right node to be a new root.
      this.root = rightNode;
    }

    // The left subtree of right node becomes the right subtree of root node.
    rootNode.setRight(rightLeftNode);

    // Attach rootNode to the left of rightNode.
    rightNode.setLeft(rootNode);
  }
}
