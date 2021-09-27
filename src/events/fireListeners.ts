/**
 * @fileoverview Declaration of the _getListenersMaps and fireListeners
 * functions.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors } from "../errors"
import { logNS as log } from "../logs";
import { events as ns0 } from "./Event"
import { events as ns1 } from "./EventListener";
import { events as ns2 } from "./EventBinder"
import { events as ns3 } from "./Listenable";
export namespace events {
  import ErrorCode = errors.ErrorCode;
  import ErrorDescription = errors.ErrorDescription;
  import Event = ns0.Event;
  import EventListener = ns1.EventListener;
  import EventBinder = ns2.EventBinder;
  import Listenable = ns3.Listenable;
  import getUid = log.getUid;

  /**
   * Returns listeners map for a given mdln-object.
   */
  function _getListenersMaps(
    node: Listenable,
  ): Map<string, Array<EventListener>> {
    const maps = ns3.listeners.get(node);
    if (!maps) {
      node.logger.error(
        log.message.getError(
          ErrorCode.LISTENERS_MAP_MISSED,
          ErrorDescription.LISTENERS_MAP_MISSED,
        ),
      );
      throw new Error(ErrorDescription.LISTENERS_MAP_MISSED);
    } else {
      return maps as Map<string, Array<EventListener>>;
    }
  }
  /**
   * Execute appropriate listeners on `event.current` listenable object.
   */
  export function fireListeners(
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
}
