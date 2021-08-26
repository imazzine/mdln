import getInternalState from "./getInternalState";
import Errors from "../enums/Errors";
import EventBinder from "../types/internal/EventBinder";
import EventListener from "../types/internal/EventListener";
import Event from "../types/public/Event";
import Listenable from "../types/public/Listenable";

const internal = getInternalState();

function _getListenersMaps(
  node: Listenable,
): Map<string, Array<EventListener>> {
  const maps = internal.listenersMaps.get(node);
  if (!maps) {
    throw new Error(Errors.LISTENERS_MAP_MISSED);
  } else {
    return maps;
  }
}

function fireListeners(
  binder: EventBinder,
  event: Event,
  capture: boolean,
): void {
  const listenable = event.current;
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
        binder.passive = listener.passive;
        listener.callback.call(undefined, event);
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
