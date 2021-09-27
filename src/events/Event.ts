/**
 * @fileoverview Declaration of the Event class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { logNS as log } from "../logs";
import { events as ns0 } from "./EventBinder";
import { events as ns1 } from "./EventPhase";
import { events as ns2 } from "./Listenable";
export namespace events {
  import EventBinder = ns0.EventBinder;
  import EventPhase = ns1.EventPhase;
  import Listenable = ns2.Listenable;
  import getStack = log.getStack;
  const _type = Symbol("_type");
  const _binder = Symbol("_binder");
  const _stack = Symbol("_stack");
  const _created = Symbol("_created");
  const _scope = Symbol("_scope");

  /**
   * A class for an event objects.
   *
   * Events expect internal `EventBinder` object to be passed to the constructor
   * function. You should not try to instantiate this object manually. Use
   * {@link Listenable.dispatch | `Listenable#dispatch`} to dispatch an event.
   */
  export class Event {
    /**
     * Symbolic field for the event type.
     */
    private [_type]: string;

    /**
     * Symbolic field for the event binder.
     */
    private [_binder]: EventBinder;

    /**
     * Symbolic field for the event stack.
     */
    private [_stack]: string;

    /**
     * Symbolic field for the event creation moment timestamp.
     */
    private [_created]: Date;

    /**
     * Symbolic field for the event scope.
     */
    private [_scope]?: unknown;

    /**
     * Event type.
     */
    get type(): string {
      return this[_type];
    }

    /**
     * Event creation stack.
     */
    get stack(): string {
      return this[_stack];
    }

    /**
     * Event instantiation timestamp.
     */
    get created(): Date {
      return this[_created];
    }

    /**
     * Listenable object that dispatch the event.
     */
    get source(): Listenable {
      return this[_binder].source;
    }

    /**
     * Listenable object that had the listener attached.
     */
    get handler(): Listenable {
      return this[_binder].handler;
    }

    /**
     * Event processing phase.
     */
    get phase(): EventPhase {
      return this[_binder].phase;
    }

    /**
     * `false` if event has not been prevented or
     * {@link prevent | `event.prevent()`} call moment timestamp.
     */
    get prevented(): false | Date {
      return this[_binder].prevented;
    }

    /**
     * `false` if event propagation has not been stopped or
     * {@link stop | `event.stop()`} call moment timestamp.
     */
    get stopped(): false | Date {
      return this[_binder].stopped;
    }

    /**
     * Event associated scope.
     */
    get scope(): unknown {
      return this[_scope] || null;
    }

    /**
     * Class constructor.
     */
    constructor(type: string, binder: EventBinder, scope?: unknown) {
      this[_type] = type;
      this[_binder] = binder;
      this[_scope] = scope;
      this[_stack] = getStack("Instantiation stack");
      this[_created] = new Date();
    }

    /**
     * Stops the propagation of the event.
     */
    stop(): void {
      if (!this[_binder].passive) {
        this[_binder].stopped = new Date();
        this.source.logger.debug(
          log.message.getCalled(`binder`, "EventBinder", "stopped", [
            (this[_binder].stopped as Date).toUTCString(),
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
      if (!this[_binder].passive) {
        this[_binder].prevented = new Date();
        this.source.logger.debug(
          log.message.getCalled(`binder`, "EventBinder", "prevented", [
            (this[_binder].prevented as Date).toUTCString(),
          ]),
        );
      } else {
        this.source.logger.warn("prevent() ignored for passive event");
      }
    }
  }
}
