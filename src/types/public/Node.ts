/**
 * @fileoverview Declaration of the Node class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors } from "../../errors"
import { logs } from "../../logs";
import { symbols } from "../../symbols";

import getInternalState from "../../helpers/getInternalState";
import Listenable from "./Listenable";
import NodeIndex from "../internal/NodeIndex";

import ErrorCode = errors.ErrorCode;
import ErrorDescription = errors.ErrorDescription;
import construct = symbols.construct;
import destruct = symbols.destruct;

const internal = getInternalState();

function _getIndexObject(node: Node): NodeIndex {
  const index = internal.nodesIndices.get(node);
  if (!index) {
    node.logger.error(
      logs.message.getError(
        ErrorCode.NODE_INDEX_MISSED,
        ErrorDescription.NODE_INDEX_MISSED,
      ),
    );
    throw new Error(ErrorDescription.NODE_INDEX_MISSED);
  } else {
    return index;
  }
}

function _assertChild(parent: Node, child: Node): void {
  _getIndexObject(child);
  const pIndex = _getIndexObject(parent);
  const i = pIndex.children.indexOf(child);
  if (!~i) {
    parent.logger.error(
      logs.message.getError(
        ErrorCode.NODE_CHILD_MISSED,
        ErrorDescription.NODE_CHILD_MISSED,
      ),
    );
    throw new Error(ErrorDescription.NODE_CHILD_MISSED);
  }
}

/**
 * Class that provides ability to build trees of `mdln`-objects and traverse
 * through it. It responds for the not modifiable object's `insert tread`,
 * `replace tread` and the `remove thread`.
 *
 * You may subclass this class to turn your class into a monitorable
 * destructible listenable node and build more complex tree business structures
 * from such nodes.
 *
 * As a structure it additionally hosts references to the tree root node,
 * parent, previous and next nodes, and children nodes array. There is also a
 * flag which determine whether the node is connected to some tree or not.
 */
class Node extends Listenable {
  /**
   * Read-only property returns a boolean indicating whether the node is
   * connected to the tree.
   */
  get connected(): boolean {
    const index = _getIndexObject(this);
    return index.parent || index.children.length ? true : false;
  }

  /**
   * Read-only property returns a root node of the tree if node is connected,
   * and reference to itself otherwise.
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
   * Read-only property returns a parent node if exist, null otherwise.
   */
  get parent(): Node | null {
    const index = _getIndexObject(this);
    return index.parent || null;
  }

  /**
   * Read-only property returns a next node from the parent's children array
   * if it exists, null otherwise.
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
   * Read-only property returns a previous node from the parent's children
   * array if it exists, null otherwise.
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
   * Read-only property returns a children nodes array, empty if there is no
   * any child nodes.
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
   * @override
   */
  protected [construct](): void {
    super[construct]();
    this.logger.trace(logs.message.getCheckpoint("construct", "Node"));

    // construct new node index and add it to the internal state
    internal.nodesIndices.set(this, new NodeIndex());
    this.logger.debug(
      logs.message.getCalled(
        `nodeIndex[${this.uid}]`,
        "NodeIndex",
        "constructor",
        [],
      ),
    );
    this.logger.debug(
      logs.message.getCalled(
        "internal.nodesIndices",
        "Map",
        "set",
        [`{${this.uid}}`, `{nodeIndex[${this.uid}]}`],
        true,
      ),
    );
  }

  /**
   * @override
   */
  protected [destruct](): void {
    this.logger.trace(logs.message.getCheckpoint("destruct", "Node"));

    // get current node index object
    const curIndex = _getIndexObject(this);
    for (let i = 0; i < curIndex.children.length; i++) {
      curIndex.children[i].destruct();
    }

    // remove current node from the parent if specified
    if (curIndex.parent) {
      const parIndex = _getIndexObject(curIndex.parent);
      const index = parIndex.children.indexOf(this);
      parIndex.children.splice(index, 1);
      this.logger.debug(
        logs.message.getCalled(
          `nodeIndex[${curIndex.parent.uid}].children`,
          "Array",
          "splice",
          [index, 1],
        ),
      );
    }

    // remove current node index from the internal state
    internal.nodesIndices.delete(this);
    this.logger.debug(
      logs.message.getCalled("internal.nodesIndices", "Map", "delete", [
        `{${this.uid}}`,
      ]),
    );
    super[destruct]();
  }

  /**
   * Removes `child` node from the children list if it is already there, then
   * inserts it as a child `before` a reference node, if specified, and the last
   * in the children list otherwise.
   *
   * @param child Child node to insert.
   * @param before Reference node to insert before.
   */
  insert(child: Node, before?: Node): Node {
    logs.thread.start();
    this.logger.trace(
      logs.message.getCheckpoint(
        "insert",
        JSON.stringify({
          child: `{${child.uid}}`,
          before: before ? `{${before.uid}}` : undefined,
        }),
      ),
    );

    // assertion
    before && _assertChild(this, before);

    // get current node (parent) index and child node index
    const pIndex = _getIndexObject(this);
    const cIndex = _getIndexObject(child);

    // try to find child in the existing children list
    const children = pIndex.children;
    const i = children.indexOf(child);

    // remove child from the children list if exist
    if (~i) {
      children.splice(i, 1);
      this.logger.debug(
        logs.message.getCalled(
          `nodeIndex[${this.uid}].children`,
          "Array",
          "splice",
          [i, 1],
        ),
      );
    }
    if (!before) {
      // push child to the end of the children list if before is not specified
      children.push(child);
      this.logger.debug(
        logs.message.getCalled(
          `nodeIndex[${this.uid}].children`,
          "Array",
          "push",
          [`{${child.uid}}`],
        ),
      );
    } else {
      // add child before the specified node
      const idx = children.indexOf(before);
      children.splice(idx, 0, child);
      this.logger.debug(
        logs.message.getCalled(
          `nodeIndex[${this.uid}].children`,
          "Array",
          "splice",
          [idx, 0, `{${child.uid}}`],
        ),
      );
    }

    // set current node as a parent for child
    cIndex.parent = this;
    this.logger.debug(
      logs.message.getCalled(
        `nodeIndex[${child.uid}]`,
        "NodeIndex",
        "parent",
        [`{${this.uid}}`],
      ),
    );
    this.logger.info(logs.message.getInserted(child.uid, before?.uid));
    logs.thread.stop();
    return child;
  }

  /**
   * Removes `to` node from the children list if it's already there,
   * and replace `existing` children node with it.
   *
   * @param existing Node to replace.
   * @param to Node to replace with.
   */
  replace(existing: Node, to: Node): Node {
    logs.thread.start();
    this.logger.trace(
      logs.message.getCheckpoint(
        "replace",
        JSON.stringify({
          existing: `{${existing.uid}}`,
          to: `{${to.uid}}`,
        }),
      ),
    );

    // assertion
    _assertChild(this, existing);

    // get current node (parent) index and child nodes indices
    const pIndex = _getIndexObject(this);
    const eIndex = _getIndexObject(existing);
    const tIndex = _getIndexObject(to);
    const children = pIndex.children;

    // remove to-node from parent children list if exist
    if (~children.indexOf(to)) {
      const idx = children.indexOf(to);
      children.splice(idx, 1);
      this.logger.debug(
        logs.message.getCalled(
          `nodeIndex[${this.uid}].children`,
          "Array",
          "splice",
          [idx, 1],
        ),
      );
    }

    // unset existing-node parent field
    eIndex.parent = undefined;
    this.logger.debug(
      logs.message.getCalled(
        `nodeIndex[${existing.uid}]`,
        "NodeIndex",
        "parent",
        [undefined],
      ),
    );

    // set to-node parent field
    tIndex.parent = this;
    this.logger.debug(
      logs.message.getCalled(`nodeIndex[${to.uid}]`, "NodeIndex", "parent", [
        `{${this.uid}}`,
      ]),
    );

    // replace existing-node to to-node
    const idx = children.indexOf(existing);
    children.splice(idx, 1, to);
    this.logger.debug(
      logs.message.getCalled(
        `nodeIndex[${this.uid}].children`,
        "Array",
        "splice",
        [idx, 1, `{${to.uid}}`],
      ),
    );
    this.logger.info(logs.message.getReplaced(existing.uid, to.uid));
    logs.thread.stop();
    return existing;
  }

  /**
   * Removes specified `child` node from the children list.
   *
   * @param child Child node to remove.
   */
  remove(child: Node): Node {
    logs.thread.start();
    this.logger.trace(
      logs.message.getCheckpoint(
        "remove",
        JSON.stringify({
          child: `{${child.uid}}`,
        }),
      ),
    );

    // assertions
    _assertChild(this, child);

    // get parent and child indices
    const pIndex = _getIndexObject(this);
    const cIndex = _getIndexObject(child);

    // remove child node from parent children list
    const idx = pIndex.children.indexOf(child);
    pIndex.children.splice(idx, 1);
    this.logger.debug(
      logs.message.getCalled(
        `nodeIndex[${this.uid}].children`,
        "Array",
        "splice",
        [idx, 1],
      ),
    );

    // unset child node parent field
    cIndex.parent = undefined;
    this.logger.debug(
      logs.message.getCalled(
        `nodeIndex[${child.uid}]`,
        "NodeIndex",
        "parent",
        [undefined],
      ),
    );
    this.logger.info(logs.message.getRemoved(child.uid));
    logs.thread.stop();
    return child;
  }
}
export default Node;
