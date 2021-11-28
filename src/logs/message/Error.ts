/**
 * @fileoverview Declaration of the ErrorLog class for log namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace message {
  /**
   * Error log message type.
   */
  export class ErrorLog {
    code: number;
    message: string;
    constructor(code: number, message: string) {
      this.code = code;
      this.message = message;
    }
  }
}
