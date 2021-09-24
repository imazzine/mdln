/**
 * @fileoverview Declaration of the NodeIndex class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import Node from "../public/Node";

/**
 * Class that provides search index for the node.
 */
class NodeIndex {
  /**
   * Parent node.
   */
  parent?: Node;

  /**
   * Node children array.
   */
  children: Array<Node>;

  /**
   * Class constructor.
   * @param parent Parent node.
   * @param children Node children array.
   */
  constructor(parent?: Node, children?: Array<Node>) {
    this.parent = parent;
    if (children) {
      this.children = children;
    } else {
      this.children = [];
    }
  }
}
export default NodeIndex;
