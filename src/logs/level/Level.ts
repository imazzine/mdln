/**
 * @fileoverview Declaration of the LogLevel enum for logs namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace level {
  /**
   * Logging level enums.
   */
  export enum Level {
    NONE = 0,
    TRACE = 10,
    DEBUG = 20,
    INFO = 30,
    WARN = 40,
    ERROR = 50,
    FATAL = 60,
  }
}
