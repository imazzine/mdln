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
  export const sync = Symbol("sync");
  export const _constructing = Symbol("_constructing");
  export const _constructed = Symbol("_constructed");
  export const _destructing = Symbol("_destructing");
  export const _destructed = Symbol("_destructed");
  export const _uid = Symbol("_uid");
  export const _created = Symbol("_created");
  export const _stack = Symbol("_stack");
  export const _logger = Symbol("_logger");
  export const _timestamp = Symbol("_timestamp");
  export const _thread = Symbol("_thread");
  export const _type = Symbol("_type");
  export const _message = Symbol("_message");
  export const _level = Symbol("_level");
  export const _timeout = Symbol("_timeout");
  export const _buffer = Symbol("_buffer");
  export const _errors = Symbol("_errors");
  export const _debouncer = Symbol("_debouncer");
  export const _code = Symbol("_code");
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
   * {@link [sync] | `logger.Buffer[sync]`} method.
   */
  export const sync = symbolsNS.sync;
}
