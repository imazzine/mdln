/**
 * @fileoverview Declaration of the Changed class for log namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace message {
  /**
   * Monitorable object changed log message type.
   */
  export class Changed {
    namespace: string;
    attribute: string;
    value: boolean | number | string | Date;
    constructor(
      namespace: string,
      attribute: string,
      value: boolean | number | string | Date,
    ) {
      this.namespace = namespace;
      this.attribute = attribute;
      this.value = value;
    }
  }
}
