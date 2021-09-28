/**
 * @fileoverview Declaration of the symbols namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Index symbols namespace.
 */
export namespace symbolsNS {
  export const construct = Symbol("construct");
  export const destruct = Symbol("destruct");
  export const log = Symbol("log");
  export const _constructing = Symbol("_constructing");
  export const _constructed = Symbol("_constructed");
  export const _destructing = Symbol("_destructing");
  export const _destructed = Symbol("_destructed");
  export const _uid = Symbol("_uid");
  export const _created = Symbol("_created");
  export const _stack = Symbol("_stack");
  export const _logger = Symbol("_logger");
}

/**
 * Public symbols namespace.
 */
export namespace symbols {
  /**
   * Symbol to get access to the protected symbolic
   * {@link [construct] | `Monitorable[construct]`} method.
   */
  export const construct = symbolsNS.construct;

  /**
   * Symbol to get access to the protected symbolic
   * {@link [destruct] | `Destructible[destruct]`} method.
   */
  export const destruct = symbolsNS.destruct;

  /**
   * Symbol to get access to the protected symbolic
   * {@link [log] | `Logger[log]`} method.
   */
  export const log = symbolsNS.log;
}
