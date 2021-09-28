/**
 * @fileoverview Declaration of the log level logic.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { level as lvl } from "./Level";
export namespace level {
  /**
   * Global log level.
   */
  let _level: Level = lvl.Level.TRACE;

  export import Level = lvl.Level;

  /**
   * Configures logging level in the runtime. Each particular logger could be
   * reconfigured independently by changing {@link Logger.level | `Logger#level`}.
   * Could be called in the runtime any number of times.
   *
   * @param level Logging level.
   */
  export function set(level: Level): void {
    _level = level;
  }

  /**
   * Returns global logging level.
   */
  export function get(): Level {
    return _level;
  }
}
