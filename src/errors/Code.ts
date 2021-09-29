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
    CONSTRUCT_IMPL = 1,
    CONSTRUCT_CALL = 2,
    DESTRUCT_IMPL = 3,
    DESTRUCT_CALL = 4,

    LISTENERS_MAP_MISSED = 5,

    NODE_INDEX_MISSED = 6,
    NODE_CHILD_MISSED = 7,
  }
}
