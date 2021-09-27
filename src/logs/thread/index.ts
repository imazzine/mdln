/**
 * @fileoverview Declaration of the log thread logic.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { helpers } from "../helpers";
import getUid = helpers.getUid;
export namespace thread {
  let thread: null | string = null;

  /**
   * Start thread.
   */
  export const start = (): void => {
    thread = getUid();
  };

  /**
   * Stop tread.
   */
  export const stop = (): void => {
    thread = null;
  };

  /**
   * Returns current thread identifier.
   */
  export const uid = (): null | string => {
    return thread;
  }
};
