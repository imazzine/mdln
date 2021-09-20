import { v5 } from "uuid";
import getInternalState from "./getInternalState";
import ErrorsCode from "../enums/ErrorsCode";
import ErrorsDescription from "../enums/ErrorsDescription";
import Logger from "../types/public/Logger";
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
    node.logger.error(
      Logger.error(
        ErrorsCode.LISTENERS_MAP_MISSED,
        ErrorsDescription.LISTENERS_MAP_MISSED,
      ),
    );
    throw new Error(ErrorsDescription.LISTENERS_MAP_MISSED);
  } else {
    return maps;
  }
}

function fireListeners(
  binder: EventBinder,
  event: Event,
  capture: boolean,
): void {
  event.target.logger.trace(
    Logger.checkpoint("mdln/helpers/fireListeners", "start"),
  );

  const listenable = event.current;
  const listeners = _getListenersMaps(listenable).get(event.type);
  if (listeners) {
    event.target.logger.trace(
      Logger.checkpoint(
        "mdln/helpers/fireListeners",
        `listeners[${event.target.uid}, ${event.type}] is exist`,
      ),
    );

    let listener: EventListener;
    for (let i = 0; i < listeners.length; i++) {
      listener = listeners[i];
      if (
        listener.capture === capture &&
        !listener.removed &&
        !binder.stopped
      ) {
        event.target.logger.trace(
          Logger.checkpoint(
            "mdln/helpers/fireListeners",
            `listener[${event.target.uid}, ${event.type}, ${v5(
              listener.callback.toString(),
              "00000000-0000-0000-0000-000000000000",
            )}, ${capture ? "capture" : "bubble"}] is exist`,
          ),
        );

        binder.passive = listener.passive;
        event.target.logger.debug(
          Logger.variable_changed(`binder`, "EventBinder", "passive", [
            binder.passive,
          ]),
        );

        event.target.logger.trace(
          Logger.checkpoint(
            "mdln/helpers/fireListeners",
            `listener[${event.target.uid}, ${event.type}, ${v5(
              listener.callback.toString(),
              "00000000-0000-0000-0000-000000000000",
            )}, ${capture ? "capture" : "bubble"}].callback call`,
          ),
        );

        listener.callback.call(undefined, event);

        event.target.logger.trace(
          Logger.checkpoint(
            "mdln/helpers/fireListeners",
            `listener[${event.target.uid}, ${event.type}, ${v5(
              listener.callback.toString(),
              "00000000-0000-0000-0000-000000000000",
            )}, ${capture ? "capture" : "bubble"}].callback done`,
          ),
        );

        if (listener.once) {
          event.target.logger.trace(
            Logger.checkpoint(
              "mdln/helpers/fireListeners",
              "unlisten one time listener",
            ),
          );

          listenable.unlisten(event.type, listener.callback, {
            capture: capture,
          });
        }
      }
    }
  }
  event.target.logger.trace(
    Logger.checkpoint("mdln/helpers/fireListeners", "end"),
  );
}

export default fireListeners;
