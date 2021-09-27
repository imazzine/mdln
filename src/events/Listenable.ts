/**
 * @fileoverview Declaration of the Listenable class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { symbols } from "../symbols";
import { errors } from "../errors";
import { state } from "../state";
import { logNS as log } from "../logs";
import { events as ns0 } from "./Event";
import { events as ns1 } from "./EventPhase";
import { events as ns2 } from "./EventListener";
import { events as ns3 } from "./EventBinder";
export namespace events {
  import ErrorCode = errors.ErrorCode;
  import ErrorDescription = errors.ErrorDescription;
  import Destructible = state.Destructible;
  import Event = ns0.Event;
  import EventPhase = ns1.EventPhase;
  import EventListener = ns2.EventListener;
  import EventBinder = ns3.EventBinder;
  import getInternalState = state.getInternalState;
  import getAncestors = state.getAncestors;
  import getUid = log.getUid;
  import construct = symbols.construct;
  import destruct = symbols.destruct;
  const internal = getInternalState();

  /**
   * Returns listeners map for a given mdln-object.
   */
  function _getListenersMaps(
    node: Listenable,
  ): Map<string, Array<EventListener>> {
    const maps = internal.listeners.get(node) as Map<string, Array<EventListener>>;
    if (!maps) {
      node.logger.error(
        log.message.getError(
          ErrorCode.LISTENERS_MAP_MISSED,
          ErrorDescription.LISTENERS_MAP_MISSED,
        ),
      );
      throw new Error(ErrorDescription.LISTENERS_MAP_MISSED);
    } else {
      return maps;
    }
  }

  /**
   * Execute appropriate listeners on `event.current` listenable object.
   */
  function fireListeners(
    binder: EventBinder,
    event: Event,
    capture: boolean,
  ): void {
    const listenable = event.handler;
    const listeners = _getListenersMaps(listenable).get(event.type);
    if (listeners) {
      let listener: EventListener;
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
              log.message.getCalled(`binder`, "EventBinder", "passive", [
                binder.passive,
              ]),
            );
          }

          // run callback
          event.source.logger.trace(
            log.message.getCheckpoint(
              "start",
              `listener[${event.handler.uid}, ${event.type}, ${getUid(
                listener.callback,
              )}, ${capture ? "capture" : "bubble"}]`,
            ),
          );
          listener.callback.call(undefined, event);
          event.source.logger.trace(
            log.message.getCheckpoint(
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
  function dispatchEvent(
    node: Listenable,
    type: string,
    scope?: unknown,
  ): boolean {
    // construct an event binder
    const binder = new EventBinder(EventPhase.NONE, node, node);
    node.logger.debug(
      log.message.getCalled(`binder`, "EventBinder", "constructor", [
        EventPhase.NONE,
        `{${node.uid}}`,
        `{${node.uid}}`,
      ]),
    );

    // construct an event
    const event = new Event(type, binder, scope);
    node.logger.debug(
      log.message.getCalled(`event`, "Event", "constructor", [
        type,
        "{binder}",
        scope,
      ]),
    );

    // get object's ancestors if any
    const ancestors: Array<Listenable> = getAncestors(node) as Listenable[];

    // run capturing phase cycle
    for (let i = ancestors.length - 1; i >= 0; i--) {
      binder.phase = EventPhase.CAPTURING_PHASE;
      node.logger.debug(
        log.message.getCalled(`binder`, "EventBinder", "phase", [binder.phase]),
      );
      binder.handler = ancestors[i];
      node.logger.debug(
        log.message.getCalled(`binder`, "EventBinder", "handler", [
          `{${binder.handler.uid}}`,
        ]),
      );
      fireListeners(binder, event, true);
    }

    // run capturing at target if event wasn't stoped
    if (!binder.stopped) {
      binder.phase = EventPhase.AT_TARGET;
      node.logger.debug(
        log.message.getCalled(`binder`, "EventBinder", "phase", [binder.phase]),
      );
      binder.handler = node;
      node.logger.debug(
        log.message.getCalled(`binder`, "EventBinder", "current", [
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
        binder.phase = EventPhase.BUBBLING_PHASE;
        node.logger.debug(
          log.message.getCalled(`binder`, "EventBinder", "phase", [
            binder.phase,
          ]),
        );
        binder.handler = ancestors[i];
        node.logger.debug(
          log.message.getCalled(`binder`, "EventBinder", "current", [
            `{${binder.handler.uid}}`,
          ]),
        );
        fireListeners(binder, event, false);
      }
    }

    // unset event phase
    binder.phase = EventPhase.NONE;
    node.logger.debug(
      log.message.getCalled(`binder`, "EventBinder", "phase", [binder.phase]),
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
  export class Listenable extends Destructible {
    /**
     * @override
     */
    protected [construct](): void {
      super[construct]();
      this.logger.trace(log.message.getCheckpoint("construct", "Listenable"));

      // create and add new listeners map to the internal listeners maps map
      internal.listeners.set(this, new Map());
      this.logger.debug(
        log.message.getCalled(
          `listenersMap[${this.uid}]`,
          "Map",
          "constructor",
          [],
        ),
      );
      this.logger.debug(
        log.message.getCalled(
          `internal.listeners`,
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
      this.logger.trace(log.message.getCheckpoint("destruct", "Listenable"));

      // delete listeners map from the internal listeners maps map
      internal.listeners.delete(this);
      this.logger.debug(
        log.message.getCalled(
          `internal.listeners`,
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
      log.thread.start();

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
        log.message.getCheckpoint(
          "listen",
          JSON.stringify({
            eventType: eventType,
            callback: getUid(callback),
            options: opts,
          }),
        ),
      );

      // get object's listeners map
      const listenersMap = internal.listeners.get(this);
      if (typeof listenersMap === "undefined") {
        // TODO (buntarb): cleaning up logic here?
        this.logger.error(
          log.message.getError(
            ErrorCode.LISTENERS_MAP_MISSED,
            ErrorDescription.LISTENERS_MAP_MISSED,
          ),
        );
        log.thread.stop();
        throw new Error(ErrorDescription.LISTENERS_MAP_MISSED);
      }

      // initialise listener variable, get listeners array for the given event
      // type
      let listener = null;
      let listeners = listenersMap.get(eventType) as Array<EventListener>;

      // construct and add listeners array if not exists
      if (!listeners) {
        listeners = [];
        this.logger.debug(
          log.message.getCalled(
            `listeners[${this.uid}, ${eventType}]`,
            "Array",
            "constructor",
            [],
          ),
        );
        listenersMap.set(eventType, listeners);
        this.logger.debug(
          log.message.getCalled(`listenersMap[${this.uid}]`, "Map", "set", [
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
            log.message.getCalled(
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
            log.message.getCalled(
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
          log.message.getCalled(
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
          log.message.getCalled(
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
      log.thread.stop();
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
      log.thread.start();

      // parse options
      const opts = {
        capture: false,
      };
      if (options) {
        opts.capture = !!options.capture;
      }
      this.logger.trace(
        log.message.getCheckpoint(
          "unlisten",
          JSON.stringify({
            eventType: eventType,
            callback: getUid(callback),
            options: opts,
          }),
        ),
      );

      // get object's listeners map
      const listenersMap = internal.listeners.get(this);
      if (typeof listenersMap === "undefined") {
        this.logger.error(
          log.message.getError(
            ErrorCode.LISTENERS_MAP_MISSED,
            ErrorDescription.LISTENERS_MAP_MISSED,
          ),
        );
        log.thread.stop();
        throw new Error(ErrorDescription.LISTENERS_MAP_MISSED);
      }

      // get listeners array for the given event type
      const listeners = listenersMap.get(eventType) as Array<EventListener>;
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
              log.message.getCalled(
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
              log.message.getCalled(
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
            log.message.getCalled(
              `listenersMap<${this.uid}>`,
              "Map",
              "delete",
              [eventType],
            ),
          );
        }
      }
      log.thread.stop();
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
      log.thread.start();
      this.logger.trace(
        log.message.getCheckpoint(
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
        log.thread.stop();
      }
    }
  }
}