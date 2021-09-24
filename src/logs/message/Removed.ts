/**
 * @fileoverview Declaration of the Removed class for logs namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace message {
  /**
   * Node object removed log message type.
   */
  export class Removed {
    child: string;
    constructor(child: string) {
      this.child = child;
    }
  }
}
