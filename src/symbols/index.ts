/**
 * @fileoverview Declaration of the symbols namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */
 
/**
 * Namespace that provides public symbols.
 */
export namespace symbols {
  /**
   * Symbol to get access to the protected symbolic
   * {@link [construct] | `Monitorable[construct]`} method.
   */
  export const construct = Symbol("construct");

  /**
   * Symbol to get access to the protected symbolic
   * {@link [destruct] | `Destructible[destruct]`} method.
   */
  export const destruct = Symbol("destruct");

  /**
   * Symbol to get access to the protected symbolic
   * {@link [log] | `Logger[log]`} method.
   */
  export const log = Symbol("log");
}