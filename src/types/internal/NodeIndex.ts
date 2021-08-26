import Node from "../public/Node";

class NodeIndex {
  parent?: Node;
  children: Array<Node>;
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
