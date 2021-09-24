/**
 * @fileoverview Declaration of the ErrorDescription enum.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace errors {
  /**
   * Errors descriptions enum.
   */
  export enum ErrorDescription {
    CONSTRUCT_IMPL = "super[construct] call wasn't implemented",
    CONSTRUCT_CALL = "[construct] method could not be explicitly called",
    DESTRUCT_IMPL = "super[destruct] call wasn't implemented",
    DESTRUCT_CALL = "[destruct] method could not be explicitly called",

    LISTENERS_MAP_MISSED = "listeners map is missed",
    NODE_INDEX_MISSED = "index is missed for a given node",
    NODE_CHILD_MISSED = "given child is missed in the node's children list",
  }
}
