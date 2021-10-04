/**
 * @fileoverview Declaration of the Called class for log namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace message {
  /**
   * Object's method called log message type.
   */
  export class Called {
    name: string;
    type: string;
    method: string;
    args: Array<boolean | number | string | Date>;
    global: boolean;
    constructor(
      name: string,
      type: string,
      method: string,
      args: Array<boolean | number | string | Date>,
      global = false,
    ) {
      this.name = name;
      this.type = type;
      this.method = method;
      this.args = args;
      this.global = global;
    }
  }
}
