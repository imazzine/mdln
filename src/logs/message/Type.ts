/**
 * @fileoverview Declaration of the LogType enum for log namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace message {
  /**
   * Message types enum.
   */
  export enum Type {
    undefined = "undefined",
    symbol = "symbol",
    boolean = "boolean",
    number = "number",
    bigint = "bigint",
    string = "string",
    function = "function",
    object = "object",
    date = "date",
    checkpoint = "checkpoint",
    constructed = "constructed",
    changed = "changed",
    destructed = "destructed",
    inserted = "inserted",
    replaced = "replaced",
    removed = "removed",
    called = "called",
    error = "error",
  }
}
