import getInternalState from "../../helpers/getInternalState";
import dispatchEvent from "../../helpers/dispatchEvent";
import Errors from "../../enums/Errors";
import EventListener from "../internal/EventListener";
import Disposable from "./Disposable";
import Event from "./Event";

const internal = getInternalState();

/**
 * An implementation of W3C EventTarget-like interface (capture/bubble mechanism,
 * stopping event propagation, preventing default actions). Extends Disposable
 * and Monitorable behavior. In core components inheritance hierarchy it
 * responds for basic communication logic. Also, you may subclass this class
 * to turn your class into a monitorable, disposable and listenable node.
 */
class Listenable extends Disposable {
  /**
   * Class constructor.
   */
  constructor() {
    super();
    internal.listenersMaps.set(this, new Map());
  }

  /**
   * @override
   */
  protected $dispose(): void {
    internal.listenersMaps.delete(this);
    super.$dispose();
  }

  /**
   * //
   */
  listen(
    etype: string,
    callback: (event: Event) => void,
    options?: {
      capture?: boolean;
      passive?: boolean;
      once?: boolean;
    },
  ): void {
    const maps = internal.listenersMaps.get(this);
    if (typeof maps === "undefined") {
      throw new Error(Errors.LISTENERS_MAP_MISSED);
    }

    const opts = {
      capture: false,
      passive: false,
      once: false,
    };
    if (typeof options !== "undefined") {
      if (typeof options.capture === "undefined") {
        opts.capture = false;
      } else {
        opts.capture = options.capture;
      }
      if (typeof options.passive === "undefined") {
        opts.passive = false;
      } else {
        opts.passive = options.passive;
      }
      if (typeof options.once === "undefined") {
        opts.once = false;
      } else {
        opts.once = options.once;
      }
    }

    let listener = null;
    let listeners = maps.get(etype);
    if (!listeners) {
      listeners = [];
      maps.set(etype, listeners);
    }
    for (let i = 0; i < listeners.length; i++) {
      if (
        !listeners[i].removed &&
        listeners[i].callback === callback &&
        listeners[i].capture === opts.capture
      ) {
        listeners[i].passive = opts.passive;
        listeners[i].once = opts.once;
        listener = listeners[i];
      }
    }
    if (!listener) {
      listener = new EventListener(
        callback,
        opts.capture,
        opts.passive,
        false,
        opts.once,
      );
      listeners.push(listener);
    }
  }

  /**
   * //
   */
  unlisten(
    etype: string,
    callback: (event: Event) => void,
    options?: {
      capture?: boolean;
    },
  ): void {
    const maps = internal.listenersMaps.get(this);
    if (typeof maps === "undefined") {
      throw new Error(Errors.LISTENERS_MAP_MISSED);
    }

    const opts = {
      capture: false,
    };
    if (typeof options?.capture !== "undefined") {
      opts.capture = options.capture;
    } else {
      opts.capture = false;
    }

    const listeners = maps.get(etype);
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        if (
          !listeners[i].removed &&
          listeners[i].callback === callback &&
          listeners[i].capture === opts.capture
        ) {
          listeners[i].removed = true;
          listeners.splice(i, 1);
        }
      }
      if (listeners.length === 0) {
        maps.delete(etype);
      }
    }
  }

  /**
   * //
   */
  dispatch(etype: string, scope?: unknown): boolean {
    return dispatchEvent(this, etype, scope);
  }
}
export default Listenable;
