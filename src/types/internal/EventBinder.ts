/**
 * @fileoverview Declaration of the EventBinder class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import EventPhase from "../../enums/EventPhase";
import Listenable from "../public/Listenable";

/**
 * Class that holds internal event handling state .
 */
class EventBinder {
  /**
   * Event handling phase.
   */
  phase: EventPhase;

  /**
   * Passive event flag.
   */
  passive = false;

  /**
   * Stopped event flag.
   */
  stopped: false | Date = false;

  /**
   * Prevented event flag.
   */
  prevented: false | Date = false;

  /**
   * Listenable object that dispatch the event.
   */
  source: Listenable;

  /**
   * Listenable object that had the listener attached.
   */
  handler: Listenable;

  /**
   * Class constructor.
   * @param phase Event handling phase.
   * @param source Listenable object that dispatch the event.
   * @param current Listenable object that had the listener attached.
   */
  constructor(phase: EventPhase, source: Listenable, handler: Listenable) {
    this.phase = phase || EventPhase.NONE;
    this.source = source;
    this.handler = handler;
  }
}
export default EventBinder;
