/**
 * @fileoverview Declaration of the Checkpoint class for log namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace message {
  /**
   * Checkpoint log message type.
   */
  export class Checkpoint {
    name: string;
    value: string;
    constructor(name: string, value: string) {
      this.name = name;
      this.value = value;
    }
  }
}
