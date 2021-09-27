/**
 * @fileoverview Declaration of the Inserted class for log namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace message {
  /**
   * Node object inserted log message type.
   */
  export class Inserted {
    child: string;
    before?: string;
    constructor(child: string, before?: string) {
      this.child = child;
      this.before = before;
    }
  }
}
