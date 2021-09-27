/**
 * @fileoverview Declaration of the EventListener class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { events as ns } from "./Event";
export namespace events {
  import Event = ns.Event;

  /**
   * Helper class for storing certain event callback and its scope in the
   * appropriate listenersMaps map.
   */
  export class EventListener {
    /**
     * Added callback function.
     */
    callback: (evt: Event) => void;

    /**
     * Capture flag. Optional. False by default.
     */
    capture: boolean;

    /**
     * Passive flag. Optional. False by default.
     */
    passive: boolean;

    /**
     * Removed flag. Optional. False by default.
     */
    removed: boolean;

    /**
     * Once flag. Optional. False by default.
     */
    once: boolean;

    /**
     * Class constructor.
     * @param callback Added callback function.
     * @param capture Capture flag. Optional. False by default.
     * @param passive Passive flag. Optional. False by default.
     * @param removed Removed flag. Optional. False by default.
     * @param once Once flag. Optional. False by default.
     */
    constructor(
      callback: (evt: Event) => void,
      capture = false,
      passive = false,
      removed = false,
      once = false,
    ) {
      this.callback = callback;
      this.capture = capture;
      this.passive = passive;
      this.removed = removed;
      this.once = once;
    }
  }
}
