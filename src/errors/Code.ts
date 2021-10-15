/**
 * @fileoverview Declaration of the Code enum.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace errors {
  /**
   * Errors codes enum.
   */
  export enum Code {
    UNHANDLED_ERR = 1,
    CONSTRUCT_IMPL = 2,
    CONSTRUCT_CALL = 3,
    DESTRUCT_IMPL = 4,
    DESTRUCT_CALL = 5,
    LISTENERS_MAP_MISSED = 6,
    NODE_INDEX_MISSED = 7,
    NODE_CHILD_MISSED = 8,
  }
}
