/**
 * @fileoverview Declaration of the _getListenersMaps and fireListeners
 * functions.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import ErrorCode from "../enums/ErrorCode";
import ErrorDescription from "../enums/ErrorDescription";
import EventBinder from "../types/internal/EventBinder";
import EventListener from "../types/internal/EventListener";
import Logger from "../types/public/Logger";
import Event from "../types/public/Event";
import Listenable from "../types/public/Listenable";
import getInternalState from "./getInternalState";
import getUid from "./getUid";

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
      Logger.error(
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
            Logger.variable_changed(`binder`, "EventBinder", "passive", [
              binder.passive,
            ]),
          );
        }

        // run callback
        event.source.logger.trace(
          Logger.checkpoint(
            "start",
            `listener[${event.handler.uid}, ${event.type}, ${getUid(
              listener.callback,
            )}, ${capture ? "capture" : "bubble"}]`,
          ),
        );
        listener.callback.call(undefined, event);
        event.source.logger.trace(
          Logger.checkpoint(
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
