import Event from "../public/Event";

/**
 * Helper class for storing certain event listener and its scope in
 * {@link Internal.listenersMaps} map.
 */
class EventListener {
  callback: (evt: Event) => void;
  capture: boolean;
  passive: boolean;
  removed: boolean;
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
export default EventListener;
