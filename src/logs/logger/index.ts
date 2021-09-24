/**
 * @fileoverview Declaration of the logger constructor logic.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { logger as l } from "./Logger";
export namespace logger {
  let updated = false;

  /**
   * Global logger constructor.
   */
  let _constructor: typeof Logger = Logger;

  export import Logger = l.Logger;

  /**
   * Configures logger constructor in the runtime.
   */
  export function setConstructor(constructor: typeof Logger) {
    if (!updated) {
      _constructor = constructor;
      updated = true;
    }
  }

  /**
   * Returns logger constructor.
   */
  export function getConstructor() {
    return _constructor;
  }

  /**
   * Whether constructor was updated or not.
   */
  export function isUpdated() {
    return updated;
  }
};
