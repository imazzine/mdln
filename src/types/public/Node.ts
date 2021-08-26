import getInternalState from "../../helpers/getInternalState";
import Listenable from "./Listenable";
import NodeIndex from "../internal/NodeIndex";
import Errors from "../../enums/Errors";

const internal = getInternalState();

function _getIndexObject(node: Node): NodeIndex {
  const index = internal.nodesIndices.get(node);
  if (!index) {
    throw new Error(Errors.NODE_INDEX_MISSED);
  } else {
    return index;
  }
}

function _assertChild(parent: Node, child: Node): void {
  _getIndexObject(child);
  const pIndex = _getIndexObject(parent);
  const i = pIndex.children.indexOf(child);
  if (!~i) {
    throw new Error(Errors.NODE_MISSED_IN_CHILDREN);
  }
}

/**
 * //
 */
class Node extends Listenable {
  /**
   * //
   */
  get connected(): boolean {
    const index = _getIndexObject(this);
    return index.parent || index.children.length ? true : false;
  }

  /**
   * //
   */
  get root(): Node {
    let root: Node;
    let parent: Node | undefined;
    const index = _getIndexObject(this);
    root = this;
    parent = index.parent;
    while (parent) {
      root = parent;
      parent = _getIndexObject(root).parent;
    }
    return root;
  }

  /**
   * //
   */
  get parent(): Node | null {
    const index = _getIndexObject(this);
    return index.parent || null;
  }

  /**
   * //
   */
  get next(): Node | null {
    const index = _getIndexObject(this);
    const parent = index.parent;
    if (parent) {
      const i = parent.children.indexOf(this);
      if (parent.children.length > i + 1) {
        return parent.children[i + 1];
      }
    }
    return null;
  }

  /**
   * //
   */
  get previous(): Node | null {
    const index = _getIndexObject(this);
    const parent = index.parent;
    if (parent) {
      const i = parent.children.indexOf(this);
      if (i > 0) {
        return parent.children[i - 1];
      }
    }
    return null;
  }

  /**
   * //
   */
  get children(): Array<Node> {
    const index = _getIndexObject(this);
    const children: Array<Node> = [];
    for (let i = 0; i < index.children.length; i++) {
      children.push(index.children[i]);
    }
    return children;
  }

  /**
   * //
   */
  constructor() {
    super();
    internal.nodesIndices.set(this, new NodeIndex());
  }

  /**
   * @override
   * @internal
   */
  $dispose(): void {
    const curIndex = _getIndexObject(this);
    for (let i = 0; i < curIndex.children.length; i++) {
      curIndex.children[i].dispose();
    }
    if (curIndex.parent) {
      const parIndex = _getIndexObject(curIndex.parent);
      parIndex.children.splice(parIndex.children.indexOf(this), 1);
    }
    internal.nodesIndices.delete(this);
    super.$dispose();
  }

  /**
   * //
   */
  insert(child: Node, before?: Node): Node {
    before && _assertChild(this, before);
    const pIndex = _getIndexObject(this);
    const cIndex = _getIndexObject(child);
    const children = pIndex.children;
    const i = children.indexOf(child);
    if (~i) {
      children.splice(i, 1);
    }
    if (!before) {
      children.push(child);
    } else {
      children.splice(children.indexOf(before), 0, child);
    }
    cIndex.parent = this;
    return child;
  }

  /**
   * //
   */
  replace(existing: Node, to: Node): Node {
    _assertChild(this, existing);
    const pIndex = _getIndexObject(this);
    const eIndex = _getIndexObject(existing);
    const tIndex = _getIndexObject(to);
    const children = pIndex.children;
    if (~children.indexOf(to)) {
      children.splice(children.indexOf(to), 1);
    }
    eIndex.parent = undefined;
    tIndex.parent = this;
    children.splice(children.indexOf(existing), 1, to);
    return existing;
  }

  /**
   * //
   */
  remove(child: Node): Node {
    _assertChild(this, child);
    const pIndex = _getIndexObject(this);
    const cIndex = _getIndexObject(child);
    pIndex.children.splice(pIndex.children.indexOf(child), 1);
    cIndex.parent = undefined;
    return child;
  }
}

export default Node;
