/**
 * @fileoverview Declaration of the Replaced class for logs namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace message {
  /**
   * Node object replaced log message type.
   */
  export class Replaced {
    existing: string;
    to: string;
    constructor(existing: string, to: string) {
      this.existing = existing;
      this.to = to;
    }
  }
}
