/**
 * @fileoverview Declaration of the Listenable class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors } from "../errors";
import { symbolsNS } from "../symbols";
import { logNS } from "../logs";
import { events as ns0 } from "./Event";
import { events as ns1 } from "./Phase";
import { events as ns2 } from "./Listener";
import { events as ns3 } from "./Binder";
export namespace events {
  import Monitorable = logNS.Monitorable;
  import Event = ns0.Event;
  import Phase = ns1.Phase;
  import Listener = ns2.Listener;
  import Binder = ns3.Binder;
  import construct = symbolsNS.construct;
  import destruct = symbolsNS.destruct;
  import getUid = logNS.getUid;

  /**
   * Map of the listenable object listeners maps.
   */
  export const listeners: Map<
    Listenable,
    Map<string, Array<Listener>>
  > = new Map();

  /**
   * Returns listeners map for a given mdln-object.
   */
  export function getListenersMaps(
    node: Listenable,
  ): Map<string, Array<Listener>> {
    const maps = listeners.get(node);
    if (!maps) {
      node.logger.error(
        logNS.message.getError(
          errors.Code.LISTENERS_MAP_MISSED,
          errors.Description.LISTENERS_MAP_MISSED,
        ),
      );
      throw new errors.Error(
        errors.Code.LISTENERS_MAP_MISSED,
        errors.Description.LISTENERS_MAP_MISSED,
      );
    } else {
      return maps;
    }
  }

  /**
   * Map of the nodes indexes.
   */
  export const nodes: Map<
    Listenable,
    {
      parent?: Listenable;
      children: Array<Listenable>;
    }
  > = new Map();

  /**
   * Returns ancestors for a given mdln-object.
   */
  export function getAncestors(node: Listenable): Array<Listenable> {
    const ancestors: Array<Listenable> = [];
    let index = nodes.get(node);
    if (index) {
      let ancestor = index.parent;
      while (ancestor) {
        ancestors.push(ancestor);
        index = nodes.get(ancestor);
        if (!index) {
          node.logger.error(
            logNS.message.getError(
              errors.Code.NODE_INDEX_MISSED,
              errors.Description.NODE_INDEX_MISSED,
            ),
          );
          throw new errors.Error(
            errors.Code.NODE_INDEX_MISSED,
            errors.Description.NODE_INDEX_MISSED,
          );
        } else {
          ancestor = index.parent;
        }
      }
    }
    return ancestors;
  }

  /**
   * Execute appropriate listeners on `event.handler` listenable object.
   */
  export function fireListeners(
    binder: Binder,
    event: Event,
    capture: boolean,
  ): void {
    const listenable = event.handler;
    const listeners = getListenersMaps(listenable).get(event.type);
    if (listeners) {
      let listener: Listener;
      for (let i = 0; i < listeners.length; i++) {
        listener = listeners[i];
        if (
          listener.capture === capture &&
          !listener.removed &&
          !binder.stopped
        ) {
          // align binder
          if (binder.passive !== listener.passive) {
            binder.passive = listener.passive;
            event.source.logger.debug(
              logNS.message.getCalled(`binder`, "Binder", "passive", [
                binder.passive,
              ]),
            );
          }

          // run callback
          event.source.logger.trace(
            logNS.message.getCheckpoint(
              "start",
              `listener[${event.handler.uid}, ${event.type}, ${getUid(
                listener.callback,
              )}, ${capture ? "capture" : "bubble"}]`,
            ),
          );
          listener.callback.call(undefined, event);
          event.source.logger.trace(
            logNS.message.getCheckpoint(
              "end",
              `listener[${event.handler.uid}, ${event.type}, ${getUid(
                listener.callback,
              )}, ${capture ? "capture" : "bubble"}]`,
            ),
          );

          // unlisten one-time listener
          if (listener.once) {
            listenable.unlisten(event.type, listener.callback, {
              capture: capture,
            });
          }
        }
      }
    }
  }

  /**
   * Dispatches an event with the specified type and scope, and calls all
   * listeners listening for events of this type, putting generated event
   * object to the listener's callback.
   *
   * If any of the listeners returns false OR calls `event.prevent()` then this
   * function will return false. If one of the capture listeners calls
   * event.stop(), then the bubble listeners won't fire.
   */
  export function dispatchEvent(
    node: Listenable,
    type: string,
    scope?: unknown,
  ): boolean {
    // construct an event binder
    const binder = new Binder(Phase.NONE, node, node);
    node.logger.debug(
      logNS.message.getCalled(`binder`, "Binder", "constructor", [
        Phase.NONE,
        `{${node.uid}}`,
        `{${node.uid}}`,
      ]),
    );

    // construct an event
    const event = new Event(type, binder, scope);
    node.logger.debug(
      logNS.message.getCalled(`event`, "Event", "constructor", [
        type,
        "{binder}",
        scope,
      ]),
    );

    // get object's ancestors if any
    const ancestors: Array<Listenable> = getAncestors(node);

    // run capturing phase cycle
    for (let i = ancestors.length - 1; i >= 0; i--) {
      binder.phase = Phase.CAPTURING_PHASE;
      node.logger.debug(
        logNS.message.getCalled(`binder`, "Binder", "phase", [binder.phase]),
      );
      binder.handler = ancestors[i];
      node.logger.debug(
        logNS.message.getCalled(`binder`, "Binder", "handler", [
          `{${binder.handler.uid}}`,
        ]),
      );
      fireListeners(binder, event, true);
    }

    // run capturing at target if event wasn't stoped
    if (!binder.stopped) {
      binder.phase = Phase.AT_TARGET;
      node.logger.debug(
        logNS.message.getCalled(`binder`, "Binder", "phase", [binder.phase]),
      );
      binder.handler = node;
      node.logger.debug(
        logNS.message.getCalled(`binder`, "Binder", "handler", [
          `{${binder.handler.uid}}`,
        ]),
      );
      fireListeners(binder, event, true);
    }

    // run bubbling at target if event wasn't stoped
    if (!binder.stopped) {
      fireListeners(binder, event, false);
    }

    // run bubbling phase cycle if event wasn't stoped
    if (!binder.stopped) {
      for (let i = 0; !binder.stopped && i < ancestors.length; i++) {
        binder.phase = Phase.BUBBLING_PHASE;
        node.logger.debug(
          logNS.message.getCalled(`binder`, "Binder", "phase", [binder.phase]),
        );
        binder.handler = ancestors[i];
        node.logger.debug(
          logNS.message.getCalled(`binder`, "Binder", "handler", [
            `{${binder.handler.uid}}`,
          ]),
        );
        fireListeners(binder, event, false);
      }
    }

    // unset event phase
    binder.phase = Phase.NONE;
    node.logger.debug(
      logNS.message.getCalled(`binder`, "Binder", "phase", [binder.phase]),
    );
    return !binder.stopped;
  }

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
  export class Listenable extends Monitorable {
    /**
     * @override
     */
    protected [construct](): void {
      super[construct]();
      this.logger.trace(logNS.message.getCheckpoint("construct", "Listenable"));

      // create and add new listeners map to the internal listeners maps map
      listeners.set(this, new Map());
      this.logger.debug(
        logNS.message.getCalled(
          `listenersMap[${this.uid}]`,
          "Map",
          "constructor",
          [],
        ),
      );
      this.logger.debug(
        logNS.message.getCalled(
          `listeners`,
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
      this.logger.trace(logNS.message.getCheckpoint("destruct", "Listenable"));

      // delete listeners map from the internal listeners maps map
      listeners.delete(this);
      this.logger.debug(
        logNS.message.getCalled(
          `listeners`,
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
      logNS.thread.start();

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
        logNS.message.getCheckpoint(
          "listen",
          JSON.stringify({
            eventType: eventType,
            callback: getUid(callback),
            options: opts,
          }),
        ),
      );

      // get object's listeners map
      const listenersMap = listeners.get(this);
      if (typeof listenersMap === "undefined") {
        // TODO (buntarb): cleaning up logic here?
        this.logger.error(
          logNS.message.getError(
            errors.Code.LISTENERS_MAP_MISSED,
            errors.Description.LISTENERS_MAP_MISSED,
          ),
        );
        logNS.thread.stop();
        throw new errors.Error(
          errors.Code.LISTENERS_MAP_MISSED,
          errors.Description.LISTENERS_MAP_MISSED,
        );
      }

      // initialise listener variable, get listeners array for the given event
      // type
      let listener = null;
      let eventListeners = listenersMap.get(eventType) as Array<Listener>;

      // construct and add listeners array if not exists
      if (!eventListeners) {
        eventListeners = [];
        this.logger.debug(
          logNS.message.getCalled(
            `eventListeners[${this.uid}, ${eventType}]`,
            "Array",
            "constructor",
            [],
          ),
        );
        listenersMap.set(eventType, eventListeners);
        this.logger.debug(
          logNS.message.getCalled(`listenersMap[${this.uid}]`, "Map", "set", [
            eventType,
            `{eventListeners[${this.uid}, ${eventType}]}`,
          ]),
        );
      }

      // find and update (if exists and not removed) a listener equivalent to the
      // specified in arguments
      for (let i = 0; i < eventListeners.length; i++) {
        if (
          !eventListeners[i].removed &&
          eventListeners[i].callback === callback &&
          eventListeners[i].capture === opts.capture
        ) {
          listener = eventListeners[i];
          listener.passive = opts.passive;
          this.logger.debug(
            logNS.message.getCalled(
              `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
                opts.capture ? "capture" : "bubble"
              }]`,
              "Listener",
              "passive",
              [listener.passive],
            ),
          );
          listener.once = opts.once;
          this.logger.debug(
            logNS.message.getCalled(
              `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
                opts.capture ? "capture" : "bubble"
              }]`,
              "Listener",
              "once",
              [listener.once],
            ),
          );
        }
      }

      // construct new listener and add it to the listeners array
      if (!listener) {
        listener = new Listener(
          callback,
          opts.capture,
          opts.passive,
          false,
          opts.once,
        );
        this.logger.debug(
          logNS.message.getCalled(
            `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
              opts.capture ? "capture" : "bubble"
            }]`,
            "Listener",
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
        eventListeners.push(listener);
        this.logger.debug(
          logNS.message.getCalled(
            `eventListeners[${this.uid}, ${eventType}]`,
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
      logNS.thread.stop();
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
      logNS.thread.start();

      // parse options
      const opts = {
        capture: false,
      };
      if (options) {
        opts.capture = !!options.capture;
      }
      this.logger.trace(
        logNS.message.getCheckpoint(
          "unlisten",
          JSON.stringify({
            eventType: eventType,
            callback: getUid(callback),
            options: opts,
          }),
        ),
      );

      // get object's listeners map
      const listenersMap = listeners.get(this);
      if (typeof listenersMap === "undefined") {
        this.logger.error(
          logNS.message.getError(
            errors.Code.LISTENERS_MAP_MISSED,
            errors.Description.LISTENERS_MAP_MISSED,
          ),
        );
        logNS.thread.stop();
        throw new errors.Error(
          errors.Code.LISTENERS_MAP_MISSED,
          errors.Description.LISTENERS_MAP_MISSED,
        );
      }

      // get listeners array for the given event type
      const eventListeners = listenersMap.get(eventType) as Array<Listener>;
      if (eventListeners) {
        // find and remove (if exists and not removed) a listener equivalent to
        // the specified in arguments
        for (let i = 0; i < eventListeners.length; i++) {
          if (
            !eventListeners[i].removed &&
            eventListeners[i].callback === callback &&
            eventListeners[i].capture === opts.capture
          ) {
            eventListeners[i].removed = true;
            this.logger.debug(
              logNS.message.getCalled(
                `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
                  opts.capture ? "capture" : "bubble"
                }]`,
                "Listener",
                "removed",
                [eventListeners[i].removed],
              ),
            );
            eventListeners.splice(i, 1);
            this.logger.debug(
              logNS.message.getCalled(
                `eventListeners[${this.uid}, ${eventType}]`,
                "Array",
                "splice",
                [i, 1],
              ),
            );
          }
        }

        // remove listeners array for the given event type if it's empty
        if (eventListeners.length === 0) {
          listenersMap.delete(eventType);
          this.logger.debug(
            logNS.message.getCalled(
              `listenersMap<${this.uid}>`,
              "Map",
              "delete",
              [eventType],
            ),
          );
        }
      }
      logNS.thread.stop();
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
      logNS.thread.start();
      this.logger.trace(
        logNS.message.getCheckpoint(
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
        logNS.thread.stop();
      }
    }
  }
}
