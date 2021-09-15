import getInternalState from "../../helpers/getInternalState";
import dispatchEvent from "../../helpers/dispatchEvent";
import Errors from "../../enums/Errors";
import LoggerDebugActions from "../../enums/LoggerDebugActions";
import LoggerInfoActions from "../../enums/LoggerInfoActions";
import LoggerTraceActions from "../../enums/LoggerTraceActions";
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
    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "constructor",
      "entry",
    );

    internal.listenersMaps.set(this, new Map());
    this.logger.debug(
      LoggerDebugActions.INTERNAL_CHANGED,
      "listenersMaps",
      "set",
      this.uid,
    );

    this.logger.info(
      LoggerInfoActions.INSTANCE_CONSTRUCTED,
      "Listenable",
      this.uid,
    );

    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "constructor",
      "exit",
    );
  }

  /**
   * @override
   */
  protected $_dispose(): void {
    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "$_dispose",
      "entry",
    );

    internal.listenersMaps.delete(this);
    this.logger.debug(
      LoggerDebugActions.INTERNAL_CHANGED,
      "listenersMaps",
      "delete",
      this.uid,
    );

    super.$_dispose();
    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "$_dispose",
      "exit",
    );
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
    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "listen",
      "entry",
    );

    const maps = internal.listenersMaps.get(this);
    if (typeof maps === "undefined") {
      this.logger.error(1, Errors.LISTENERS_MAP_MISSED);
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
    this.logger.trace(
      LoggerTraceActions.LOG_STRINGLIFIED,
      "Listenable",
      "listen:opts",
      opts,
    );

    let listener = null;
    let listeners = maps.get(etype);
    if (!listeners) {
      listeners = [];
      maps.set(etype, listeners);
      this.logger.debug(
        LoggerDebugActions.INTERNAL_CHANGED,
        "listenersMaps",
        "set",
        etype,
      );
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
        this.logger.debug(
          LoggerDebugActions.INTERNAL_CHANGED,
          "EventListener." + etype + "." + opts.capture ? "capture" : "bubble",
          "update",
          JSON.stringify({
            passive: opts.passive,
            once: opts.once,
          }),
        );
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
      this.logger.debug(
        LoggerDebugActions.INTERNAL_CHANGED,
        "EventListener." + etype + "." + opts.capture ? "capture" : "bubble",
        "construct",
        JSON.stringify({
          passive: opts.passive,
          once: opts.once,
        }),
      );

      listeners.push(listener);
      this.logger.debug(
        LoggerDebugActions.INTERNAL_CHANGED,
        "listenersMaps." + etype,
        "push",
        "EventListener." + etype + "." + opts.capture ? "capture" : "bubble",
      );
    }
    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "listen",
      "exit",
    );
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
    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "unlisten",
      "entry",
    );

    const maps = internal.listenersMaps.get(this);
    if (typeof maps === "undefined") {
      this.logger.error(1, Errors.LISTENERS_MAP_MISSED);
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
    this.logger.trace(
      LoggerTraceActions.LOG_STRINGLIFIED,
      "Listenable",
      "unlisten:opts",
      opts,
    );

    const listeners = maps.get(etype);
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        if (
          !listeners[i].removed &&
          listeners[i].callback === callback &&
          listeners[i].capture === opts.capture
        ) {
          listeners[i].removed = true;
          this.logger.debug(
            LoggerDebugActions.INTERNAL_CHANGED,
            "EventListener." + etype + "." + opts.capture
              ? "capture"
              : "bubble",
            "update",
            JSON.stringify({
              removed: true,
            }),
          );

          listeners.splice(i, 1);
          this.logger.debug(
            LoggerDebugActions.INTERNAL_CHANGED,
            "listenersMaps." + etype,
            "splice",
            "EventListener." + etype + "." + opts.capture
              ? "capture"
              : "bubble",
          );
        }
      }
      if (listeners.length === 0) {
        maps.delete(etype);
        this.logger.debug(
          LoggerDebugActions.INTERNAL_CHANGED,
          "listenersMaps",
          "delete",
          etype,
        );
      }
    }
    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "listen",
      "exit",
    );
  }

  /**
   * //
   */
  dispatch(etype: string, scope?: unknown): boolean {
    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "dispatch",
      "entry",
    );

    const result = dispatchEvent(this, etype, scope);
    this.logger.trace(
      LoggerTraceActions.LOG_STRINGLIFIED,
      "Listenable",
      "dispatch:result",
      result,
    );

    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Listenable",
      "dispatch",
      "exit",
    );
    return result;
  }
}
export default Listenable;
