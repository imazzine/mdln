/**
 * @fileoverview Declaration of the Event class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import EventPhase from "../../enums/EventPhase";
import getStack from "../../helpers/getStack";
import EventBinder from "../internal/EventBinder";
import Logger from "./Logger";
import Listenable from "./Listenable";

const eventType = Symbol("type");
const eventBinder = Symbol("binder");
const eventStack = Symbol("stack");
const eventCreated = Symbol("created");
const eventScope = Symbol("scope");

/**
 * A class for event objects.
 */
class Event {
  /**
   * Symbolic field for the event type.
   */
  private [eventType]: string;

  /**
   * Symbolic field for the event binder.
   */
  private [eventBinder]: EventBinder;

  /**
   * Symbolic field for the event stack.
   */
  private [eventStack]: string;

  /**
   * Symbolic field for the event creation moment timestamp.
   */
  private [eventCreated]: Date;

  /**
   * Symbolic field for the event scope.
   */
  private [eventScope]?: unknown;

  /**
   * Event type.
   */
  get type(): string {
    return this[eventType];
  }

  /**
   * Event creation stack.
   */
  get stack(): string {
    return this[eventStack];
  }

  /**
   * Event instantiation timestamp.
   */
  get created(): Date {
    return this[eventCreated];
  }

  /**
   * Listenable object that dispatch the event.
   */
  get source(): Listenable {
    return this[eventBinder].source;
  }

  /**
   * Listenable object that had the listener attached.
   */
  get handler(): Listenable {
    return this[eventBinder].handler;
  }

  /**
   * Event processing phase.
   */
  get phase(): EventPhase {
    return this[eventBinder].phase;
  }

  /**
   * `false` if event has not been prevented or
   * {@link prevent | `event.prevent()`} call moment timestamp.
   */
  get prevented(): false | Date {
    return this[eventBinder].prevented;
  }

  /**
   * `false` if event propagation has not been stopped or
   * {@link stop | `event.stop()`} call moment timestamp.
   */
  get stopped(): false | Date {
    return this[eventBinder].stopped;
  }

  /**
   * Event associated scope.
   */
  get scope(): unknown {
    return this[eventScope] || null;
  }

  /**
   * Class constructor.
   */
  constructor(type: string, binder: EventBinder, scope?: unknown) {
    this[eventType] = type;
    this[eventBinder] = binder;
    this[eventScope] = scope;
    this[eventStack] = getStack("Instantiation stack");
    this[eventCreated] = new Date();
  }

  /**
   * Stops the propagation of the event.
   */
  stop(): void {
    if (!this[eventBinder].passive) {
      this[eventBinder].stopped = new Date();
      this.source.logger.debug(
        Logger.variable_changed(`binder`, "EventBinder", "stopped", [
          (this[eventBinder].stopped as Date).toUTCString(),
        ]),
      );
    } else {
      this.source.logger.warn("stop() ignored for passive event");
    }
  }

  /**
   * Prevents the default action.
   */
  prevent(): void {
    if (!this[eventBinder].passive) {
      this[eventBinder].prevented = new Date();
      this.source.logger.debug(
        Logger.variable_changed(`binder`, "EventBinder", "prevented", [
          (this[eventBinder].prevented as Date).toUTCString(),
        ]),
      );
    } else {
      this.source.logger.warn("prevent() ignored for passive event");
    }
  }
}
export default Event;
