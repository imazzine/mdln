/**
 * @fileoverview Declaration of the _getListenersMaps and fireListeners
 * functions.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors } from "../errors"
import { events } from "../events"
import { logs } from "../logs";

import EventBinder from "../types/internal/EventBinder";
import EventListener from "../types/internal/EventListener";
import Listenable from "../types/public/Listenable";
import getInternalState from "./getInternalState";

import ErrorCode = errors.ErrorCode;
import ErrorDescription = errors.ErrorDescription;
import Event = events.Event;
import getUid = logs.getUid;

const internal = getInternalState();

/**
 * Returns listeners map for a given mdln-object.
 */
function _getListenersMaps(
  node: Listenable,
): Map<string, Array<EventListener>> {
  const maps = internal.listenersMaps.get(node);
  if (!maps) {
    node.logger.error(
      logs.message.getError(
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
            logs.message.getCalled(`binder`, "EventBinder", "passive", [
              binder.passive,
            ]),
          );
        }

        // run callback
        event.source.logger.trace(
          logs.message.getCheckpoint(
            "start",
            `listener[${event.handler.uid}, ${event.type}, ${getUid(
              listener.callback,
            )}, ${capture ? "capture" : "bubble"}]`,
          ),
        );
        listener.callback.call(undefined, event);
        event.source.logger.trace(
          logs.message.getCheckpoint(
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

export default fireListeners;
