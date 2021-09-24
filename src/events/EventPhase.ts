/**
 * @fileoverview Declaration of the EventPhase enum.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace events {
  /**
   * Event phases enums.
   */
  export enum EventPhase {
    NONE = 0,
    CAPTURING_PHASE = 1,
    AT_TARGET = 2,
    BUBBLING_PHASE = 3,
  }
}
