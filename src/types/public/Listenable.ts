/**
 * @fileoverview Declaration of the Listenable class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors } from "../../errors";
import { events } from "../../events";
import { logs } from "../../logs";
import { symbols } from "../../symbols";

import getInternalState from "../../helpers/getInternalState";
import dispatchEvent from "../../helpers/dispatchEvent";
import EventListener from "../internal/EventListener";
import Destructible from "./Destructible";

import ErrorCode = errors.ErrorCode;
import ErrorDescription = errors.ErrorDescription;
import Event = events.Event;

import getUid = logs.getUid;
import construct = symbols.construct;
import destruct = symbols.destruct;

const internal = getInternalState();

/**
 * Class that provides communication layer for the `mdln`-objects. It responds
 * for the object's `listen tread`, `unlisten tread` and the `dispatch thread`.
 *
 * As a structure it does not provide any additional public properties.
 *
 * Communication approach is very similar to W3C
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget | `EventTarget`}
 * interface with it's `capture` and `bubble` mechanism, stopping event
 * propagation and preventing default actions.
 *
 * Extends {@link Destructible | `Destructible`} and
 * {@link Monitorable | `Monitorable`} behavior. You may subclass this class to
 * turn your class into a monitorable, destructible and listenable object.
 */
class Listenable extends Destructible {
  /**
   * @override
   */
  protected [construct](): void {
    super[construct]();
    this.logger.trace(logs.message.getCheckpoint("construct", "Listenable"));

    // create and add new listeners map to the internal listeners maps map
    internal.listenersMaps.set(this, new Map());
    this.logger.debug(
      logs.message.getCalled(
        `listenersMap[${this.uid}]`,
        "Map",
        "constructor",
        [],
      ),
    );
    this.logger.debug(
      logs.message.getCalled(
        `internal.listenersMaps`,
        "Map",
        "set",
        [`{${this.uid}}`, `{listenersMap[${this.uid}]}`],
        true,
      ),
    );
  }

  /**
   * @override
   */
  protected [destruct](): void {
    this.logger.trace(logs.message.getCheckpoint("destruct", "Listenable"));

    // delete listeners map from the internal listeners maps map
    internal.listenersMaps.delete(this);
    this.logger.debug(
      logs.message.getCalled(
        `internal.listenersMaps`,
        "Map",
        "delete",
        [`{${this.uid}}`],
        true,
      ),
    );
    super[destruct]();
  }

  /**
   * Adds an event listener. A listener can only be added once to an object and
   * if it is added again only `passive` and `once` options are applied to the
   * registered one.
   *
   * Execute not modifiable `listen thread`.
   *
   * @param eventType Event type.
   * @param callback Callback function to run.
   * @param options Callback options:
   * @param options.capture Execute listener on the `capture` phase.
   * @param options.passive Ignore {@link Event.stop | `event.stop()`} and
   * {@link Event.prevent | `event.prevent()`} calls from a listener.
   * @param options.once Remove listener after it was executed first time.
   */
  listen(
    eventType: string,
    callback: (event: Event) => void,
    options?: {
      capture?: boolean;
      passive?: boolean;
      once?: boolean;
    },
  ): void {
    logs.thread.start();

    // parse options
    const opts = {
      capture: false,
      passive: false,
      once: false,
    };
    if (options) {
      opts.capture = !!options.capture;
      opts.passive = !!options.passive;
      opts.once = !!options.once;
    }
    this.logger.trace(
      logs.message.getCheckpoint(
        "listen",
        JSON.stringify({
          eventType: eventType,
          callback: getUid(callback),
          options: opts,
        }),
      ),
    );

    // get object's listeners map
    const listenersMap = internal.listenersMaps.get(this);
    if (typeof listenersMap === "undefined") {
      // TODO (buntarb): cleaning up logic here?
      this.logger.error(
        logs.message.getError(
          ErrorCode.LISTENERS_MAP_MISSED,
          ErrorDescription.LISTENERS_MAP_MISSED,
        ),
      );
      logs.thread.stop();
      throw new Error(ErrorDescription.LISTENERS_MAP_MISSED);
    }

    // initialise listener variable, get listeners array for the given event
    // type
    let listener = null;
    let listeners = listenersMap.get(eventType);

    // construct and add listeners array if not exists
    if (!listeners) {
      listeners = [];
      this.logger.debug(
        logs.message.getCalled(
          `listeners[${this.uid}, ${eventType}]`,
          "Array",
          "constructor",
          [],
        ),
      );
      listenersMap.set(eventType, listeners);
      this.logger.debug(
        logs.message.getCalled(`listenersMap[${this.uid}]`, "Map", "set", [
          eventType,
          `{listeners[${this.uid}, ${eventType}]}`,
        ]),
      );
    }

    // find and update (if exists and not removed) a listener equivalent to the
    // specified in arguments
    for (let i = 0; i < listeners.length; i++) {
      if (
        !listeners[i].removed &&
        listeners[i].callback === callback &&
        listeners[i].capture === opts.capture
      ) {
        listener = listeners[i];
        listener.passive = opts.passive;
        this.logger.debug(
          logs.message.getCalled(
            `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
              opts.capture ? "capture" : "bubble"
            }]`,
            "EventListener",
            "passive",
            [listener.passive],
          ),
        );
        listener.once = opts.once;
        this.logger.debug(
          logs.message.getCalled(
            `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
              opts.capture ? "capture" : "bubble"
            }]`,
            "EventListener",
            "once",
            [listener.once],
          ),
        );
      }
    }

    // construct new listener and add it to the listeners array
    if (!listener) {
      listener = new EventListener(
        callback,
        opts.capture,
        opts.passive,
        false,
        opts.once,
      );
      this.logger.debug(
        logs.message.getCalled(
          `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
            opts.capture ? "capture" : "bubble"
          }]`,
          "EventListener",
          "constructor",
          [
            listener.callback.toString(),
            listener.capture,
            listener.passive,
            listener.removed,
            listener.once,
          ],
        ),
      );
      listeners.push(listener);
      this.logger.debug(
        logs.message.getCalled(
          `listeners[${this.uid}, ${eventType}]`,
          "Array",
          "push",
          [
            `{listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
              opts.capture ? "capture" : "bubble"
            }]}`,
          ],
        ),
      );
    }
    logs.thread.stop();
  }

  /**
   * Removes an event listener which was added with the {@link listen | `listen`}.
   *
   * Execute not modifiable `unlisten thread`.
   *
   * @param eventType Event type.
   * @param callback Callback function to run.
   * @param options Callback options:
   * @param options.capture Execute listener on the `capture` phase.
   */
  unlisten(
    eventType: string,
    callback: (event: Event) => void,
    options?: {
      capture?: boolean;
    },
  ): void {
    logs.thread.start();

    // parse options
    const opts = {
      capture: false,
    };
    if (options) {
      opts.capture = !!options.capture;
    }
    this.logger.trace(
      logs.message.getCheckpoint(
        "unlisten",
        JSON.stringify({
          eventType: eventType,
          callback: getUid(callback),
          options: opts,
        }),
      ),
    );

    // get object's listeners map
    const listenersMap = internal.listenersMaps.get(this);
    if (typeof listenersMap === "undefined") {
      this.logger.error(
        logs.message.getError(
          ErrorCode.LISTENERS_MAP_MISSED,
          ErrorDescription.LISTENERS_MAP_MISSED,
        ),
      );
      logs.thread.stop();
      throw new Error(ErrorDescription.LISTENERS_MAP_MISSED);
    }

    // get listeners array for the given event type
    const listeners = listenersMap.get(eventType);
    if (listeners) {
      // find and remove (if exists and not removed) a listener equivalent to
      // the specified in arguments
      for (let i = 0; i < listeners.length; i++) {
        if (
          !listeners[i].removed &&
          listeners[i].callback === callback &&
          listeners[i].capture === opts.capture
        ) {
          listeners[i].removed = true;
          this.logger.debug(
            logs.message.getCalled(
              `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
                opts.capture ? "capture" : "bubble"
              }]`,
              "EventListener",
              "removed",
              [listeners[i].removed],
            ),
          );
          listeners.splice(i, 1);
          this.logger.debug(
            logs.message.getCalled(
              `listeners[${this.uid}, ${eventType}]`,
              "Array",
              "splice",
              [i, 1],
            ),
          );
        }
      }

      // remove listeners array for the given event type if it's empty
      if (listeners.length === 0) {
        listenersMap.delete(eventType);
        this.logger.debug(
          logs.message.getCalled(
            `listenersMap<${this.uid}>`,
            "Map",
            "delete",
            [eventType],
          ),
        );
      }
    }
    logs.thread.stop();
  }

  /**
   * Dispatches an {@link Event | `event`} with the specified `type` and
   * `scope`, and calls all listeners listening for {@link Event | `events`}
   * of this type, putting generated {@link Event | `event`} object to the
   * listener's callback.
   *
   * If any of the listeners returns `false` OR calls `event.prevent()` then
   * this function will return `false`. If one of the capture listeners calls
   * `event.stop()`, then the bubble listeners won't fire.
   *
   * Initialise and finish `dispatch thread`.
   *
   * @param eventType Event type.
   * @param eventScope User defined data associated with the event.
   */
  dispatch(eventType: string, eventScope?: unknown): boolean {
    logs.thread.start();
    this.logger.trace(
      logs.message.getCheckpoint(
        "dispatch",
        JSON.stringify({
          eventType,
          eventScope: eventScope ? "scope" : undefined,
        }),
      ),
    );

    // safe call of existing listeners
    try {
      return dispatchEvent(this, eventType, eventScope);
    } finally {
      logs.thread.stop();
    }
  }
}
export default Listenable;
