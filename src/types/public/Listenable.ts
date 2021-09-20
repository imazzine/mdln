import getUid from "../../helpers/getUid";
import getInternalState from "../../helpers/getInternalState";
import dispatchEvent from "../../helpers/dispatchEvent";
import ErrorsCode from "../../enums/ErrorsCode";
import ErrorsDescription from "../../enums/ErrorsDescription";
import EventListener from "../internal/EventListener";
import { construct } from "./Monitorable";
import { destruct, Destructible } from "./Destructible";
import Event from "./Event";
import Logger from "./Logger";

const internal = getInternalState();

/**
 * An implementation of W3C EventTarget-like interface (capture/bubble mechanism,
 * stopping event propagation, preventing default actions). Extends Disposable
 * and Monitorable behavior. In core components inheritance hierarchy it
 * responds for basic communication logic. Also, you may subclass this class
 * to turn your class into a monitorable, disposable and listenable node.
 */
class Listenable extends Destructible {
  protected [construct](): void {
    super[construct]();

    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/constructor", "start"),
    );

    internal.listenersMaps.set(this, new Map());

    this.logger.debug(
      Logger.variable_changed(
        `listenersMap[${this.uid}]`,
        "Map",
        "constructor",
        [],
      ),
    );
    this.logger.debug(
      Logger.variable_changed(
        `internal.listenersMaps`,
        "Map",
        "set",
        [`{${this.uid}}`, `{listenersMap[${this.uid}]}`],
        true,
      ),
    );

    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/constructor", "end"),
    );
  }

  /**
   * @override
   */
  protected [destruct](): void {
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/$_dispose", "start"),
    );

    internal.listenersMaps.delete(this);

    this.logger.debug(
      Logger.variable_changed(
        `internal.listenersMaps`,
        "Map",
        "delete",
        [`{${this.uid}}`],
        true,
      ),
    );
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/$_dispose", "end"),
    );
    super[destruct]();
  }

  /**
   * //
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
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/listen", "start"),
    );

    const maps = internal.listenersMaps.get(this);
    if (typeof maps === "undefined") {
      this.logger.error(
        Logger.error(
          ErrorsCode.LISTENERS_MAP_MISSED,
          ErrorsDescription.LISTENERS_MAP_MISSED,
        ),
      );
      throw new Error(ErrorsDescription.LISTENERS_MAP_MISSED);
    }

    const opts = {
      capture: false,
      passive: false,
      once: false,
    };
    if (typeof options !== "undefined") {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Listenable/listen",
          "options are defined",
        ),
      );

      if (typeof options.capture === "undefined") {
        this.logger.trace(
          Logger.checkpoint(
            "mdln/types/public/Listenable/listen",
            "options.capture is unset",
          ),
        );

        opts.capture = false;
      } else {
        this.logger.trace(
          Logger.checkpoint(
            "mdln/types/public/Listenable/listen",
            `options.capture is set to ${options.capture.toString()}`,
          ),
        );

        opts.capture = options.capture;
      }
      if (typeof options.passive === "undefined") {
        this.logger.trace(
          Logger.checkpoint(
            "mdln/types/public/Listenable/listen",
            "options.passive is unset",
          ),
        );
        opts.passive = false;
      } else {
        this.logger.trace(
          Logger.checkpoint(
            "mdln/types/public/Listenable/listen",
            `options.passive is set to ${options.passive.toString()}`,
          ),
        );
        opts.passive = options.passive;
      }
      if (typeof options.once === "undefined") {
        this.logger.trace(
          Logger.checkpoint(
            "mdln/types/public/Listenable/listen",
            "options.once is unset",
          ),
        );
        opts.once = false;
      } else {
        this.logger.trace(
          Logger.checkpoint(
            "mdln/types/public/Listenable/listen",
            `options.once is set to ${options.once.toString()}`,
          ),
        );
        opts.once = options.once;
      }
    }

    let listener = null;
    let listeners = maps.get(eventType);
    if (!listeners) {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Listenable/listen",
          `listeners[${this.uid}, ${eventType}] in not exist`,
        ),
      );

      listeners = [];
      this.logger.debug(
        Logger.variable_changed(
          `listeners[${this.uid}, ${eventType}]`,
          "Array",
          "constructor",
          [],
        ),
      );

      maps.set(eventType, listeners);
      this.logger.debug(
        Logger.variable_changed(`listenersMap[${this.uid}]`, "Map", "set", [
          eventType,
          `{listeners[${this.uid}, ${eventType}]}`,
        ]),
      );
    } else {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Listenable/listen",
          `listeners[${this.uid}, ${eventType}] is exist`,
        ),
      );
    }
    for (let i = 0; i < listeners.length; i++) {
      if (
        !listeners[i].removed &&
        listeners[i].callback === callback &&
        listeners[i].capture === opts.capture
      ) {
        listener = listeners[i];
        this.logger.trace(
          Logger.checkpoint(
            "mdln/types/public/Listenable/listen",
            `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
              opts.capture ? "capture" : "bubble"
            }] is exist`,
          ),
        );

        listener.passive = opts.passive;
        this.logger.debug(
          Logger.variable_changed(
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
          Logger.variable_changed(
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
    if (!listener) {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Listenable/listen",
          `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
            opts.capture ? "capture" : "bubble"
          }] is not exist`,
        ),
      );

      listener = new EventListener(
        callback,
        opts.capture,
        opts.passive,
        false,
        opts.once,
      );
      this.logger.debug(
        Logger.variable_changed(
          `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
            opts.capture ? "capture" : "bubble"
          }]`,
          "EventListener",
          "constructor",
          [callback.toString(), opts.capture, opts.passive, false, opts.once],
        ),
      );

      listeners.push(listener);
      this.logger.debug(
        Logger.variable_changed(
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
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/listen", "end"),
    );
  }

  /**
   * //
   */
  unlisten(
    eventType: string,
    callback: (event: Event) => void,
    options?: {
      capture?: boolean;
    },
  ): void {
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/unlisten", "start"),
    );

    const maps = internal.listenersMaps.get(this);
    if (typeof maps === "undefined") {
      this.logger.error(
        Logger.error(
          ErrorsCode.LISTENERS_MAP_MISSED,
          ErrorsDescription.LISTENERS_MAP_MISSED,
        ),
      );
      throw new Error(ErrorsDescription.LISTENERS_MAP_MISSED);
    }

    const opts = {
      capture: false,
    };
    if (typeof options?.capture !== "undefined") {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Listenable/unlisten",
          `options.capture is set to ${options.capture.toString()}`,
        ),
      );

      opts.capture = options.capture;
    }

    const listeners = maps.get(eventType);
    if (listeners) {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Listenable/unlisten",
          `listeners[${this.uid}, ${eventType}] is exist`,
        ),
      );

      for (let i = 0; i < listeners.length; i++) {
        if (
          !listeners[i].removed &&
          listeners[i].callback === callback &&
          listeners[i].capture === opts.capture
        ) {
          this.logger.trace(
            Logger.checkpoint(
              "mdln/types/public/Listenable/unlisten",
              `listener[${this.uid}, ${eventType}, ${getUid(callback)}, ${
                opts.capture ? "capture" : "bubble"
              }] is exist`,
            ),
          );

          listeners[i].removed = true;
          this.logger.debug(
            Logger.variable_changed(
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
            Logger.variable_changed(
              `listeners[${this.uid}, ${eventType}]`,
              "Array",
              "splice",
              [i, 1],
            ),
          );
        }
      }
      if (listeners.length === 0) {
        this.logger.trace(
          Logger.checkpoint(
            "mdln/types/public/Listenable/unlisten",
            `listeners[${this.uid}, ${eventType}] is empty`,
          ),
        );

        maps.delete(eventType);
        this.logger.debug(
          Logger.variable_changed(
            `listenersMap<${this.uid}>`,
            "Map",
            "delete",
            [eventType],
          ),
        );
      }
    }
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/unlisten", "end"),
    );
  }

  /**
   * //
   */
  dispatch(eventType: string, eventScope?: unknown): boolean {
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/dispatch", "start"),
    );

    const result = dispatchEvent(this, eventType, eventScope);

    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Listenable/dispatch", "end"),
    );
    return result;
  }
}
export default Listenable;
