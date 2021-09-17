import getInternalState from "../../helpers/getInternalState";
import Listenable from "./Listenable";
import NodeIndex from "../internal/NodeIndex";
import Errors from "../../enums/Errors";
import Logger from "./Logger";
import { threadId } from "worker_threads";

const internal = getInternalState();

function _getIndexObject(node: Node): NodeIndex {
  const index = internal.nodesIndices.get(node);
  if (!index) {
    node.logger.error(Logger.error(1, Errors.NODE_INDEX_MISSED));
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
    parent.logger.error(Logger.error(1, Errors.NODE_MISSED_IN_CHILDREN));
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
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/constructor", "start"),
    );

    internal.nodesIndices.set(this, new NodeIndex());
    this.logger.debug(
      Logger.variable_changed(
        `nodeIndex[${this.uid}]`,
        "NodeIndex",
        "constructor",
        [],
      ),
    );
    this.logger.debug(
      Logger.variable_changed(
        "internal.nodesIndices",
        "Map",
        "set",
        [`{${this.uid}}`, `{nodeIndex[${this.uid}]}`],
        true,
      ),
    );

    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/constructor", "end"),
    );
  }

  /**
   * @override
   * @internal
   */
  $_dispose(): void {
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/$_dispose", "start"),
    );

    const curIndex = _getIndexObject(this);

    this.logger.trace(
      Logger.checkpoint(
        "mdln/types/public/Node/$_dispose",
        "children disposing start",
      ),
    );
    for (let i = 0; i < curIndex.children.length; i++) {
      curIndex.children[i].dispose();
    }
    this.logger.trace(
      Logger.checkpoint(
        "mdln/types/public/Node/$_dispose",
        "children disposing end",
      ),
    );

    if (curIndex.parent) {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Node/$_dispose",
          `parent is exist {${curIndex.parent.uid}}`,
        ),
      );

      const parIndex = _getIndexObject(curIndex.parent);
      const index = parIndex.children.indexOf(this);
      parIndex.children.splice(index, 1);
      this.logger.debug(
        Logger.variable_changed(
          `nodeIndex[${curIndex.parent.uid}].children`,
          "Array",
          "splice",
          [index, 1],
        ),
      );
    }

    internal.nodesIndices.delete(this);
    this.logger.debug(
      Logger.variable_changed("internal.nodesIndices", "Map", "delete", [
        `{${this.uid}}`,
      ]),
    );

    super.$_dispose();

    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/$_dispose", "end"),
    );
  }

  /**
   * //
   */
  insert(child: Node, before?: Node): Node {
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/insert", "start"),
    );

    before && _assertChild(this, before);
    const pIndex = _getIndexObject(this);
    const cIndex = _getIndexObject(child);
    const children = pIndex.children;
    const i = children.indexOf(child);
    if (~i) {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Node/insert",
          `{${child.uid}} is a child`,
        ),
      );

      children.splice(i, 1);
      this.logger.debug(
        Logger.variable_changed(
          `nodeIndex[${this.uid}].children`,
          "Array",
          "splice",
          [i, 1],
        ),
      );
    }

    if (!before) {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Node/insert",
          `before not specified`,
        ),
      );

      children.push(child);
      this.logger.debug(
        Logger.variable_changed(
          `nodeIndex[${this.uid}].children`,
          "Array",
          "push",
          [`{${child.uid}}`],
        ),
      );
    } else {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Node/insert",
          `before is set to {${before.uid}}`,
        ),
      );

      const idx = children.indexOf(before);
      children.splice(idx, 0, child);
      this.logger.debug(
        Logger.variable_changed(
          `nodeIndex[${this.uid}].children`,
          "Array",
          "splice",
          [idx, 0, `{${child.uid}}`],
        ),
      );
    }

    cIndex.parent = this;
    this.logger.debug(
      Logger.variable_changed(
        `nodeIndex[${child.uid}]`,
        "NodeIndex",
        "parent",
        [`{${this.uid}}`],
      ),
    );

    this.logger.info(Logger.node_inserted(child.uid, before?.uid));

    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/insert", "end"),
    );
    return child;
  }

  /**
   * //
   */
  replace(existing: Node, to: Node): Node {
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/replace", "start"),
    );

    _assertChild(this, existing);
    const pIndex = _getIndexObject(this);
    const eIndex = _getIndexObject(existing);
    const tIndex = _getIndexObject(to);
    const children = pIndex.children;
    if (~children.indexOf(to)) {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Node/replace",
          `{${to.uid}} is alredy in the children list`,
        ),
      );

      const idx = children.indexOf(to);
      children.splice(idx, 1);
      this.logger.debug(
        Logger.variable_changed(
          `nodeIndex[${this.uid}].children`,
          "Array",
          "splice",
          [idx, 1],
        ),
      );
    }

    eIndex.parent = undefined;
    this.logger.debug(
      Logger.variable_changed(
        `nodeIndex[${existing.uid}]`,
        "NodeIndex",
        "parent",
        [undefined],
      ),
    );

    tIndex.parent = this;
    this.logger.debug(
      Logger.variable_changed(`nodeIndex[${to.uid}]`, "NodeIndex", "parent", [
        `{${this.uid}}`,
      ]),
    );

    const idx = children.indexOf(existing);
    children.splice(idx, 1, to);
    this.logger.debug(
      Logger.variable_changed(
        `nodeIndex[${this.uid}].children`,
        "Array",
        "splice",
        [idx, 1, `{${to.uid}}`],
      ),
    );

    this.logger.info(Logger.node_replaced(existing.uid, to.uid));

    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/replace", "end"),
    );
    return existing;
  }

  /**
   * //
   */
  remove(child: Node): Node {
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/remove", "start"),
    );

    _assertChild(this, child);
    const pIndex = _getIndexObject(this);
    const cIndex = _getIndexObject(child);

    const idx = pIndex.children.indexOf(child);
    pIndex.children.splice(idx, 1);
    this.logger.debug(
      Logger.variable_changed(
        `nodeIndex[${this.uid}].children`,
        "Array",
        "splice",
        [idx, 1],
      ),
    );

    cIndex.parent = undefined;
    this.logger.debug(
      Logger.variable_changed(
        `nodeIndex[${child.uid}]`,
        "NodeIndex",
        "parent",
        [undefined],
      ),
    );

    this.logger.info(Logger.node_removed(child.uid));

    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Node/remove", "end"),
    );
    return child;
  }
}
export default Node;
