/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * @fileoverview Declaration of the Logger class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { symbolsNS } from "../../symbols";
import { helpers } from "../helpers";
import { thread } from "../thread";
import { level } from "../level";
import { message as msg } from "../message";
import { logger as ns0 } from "./Log";
import { logger as ns1 } from "./Buffer";
export namespace logger {
  import Level = level.Level;
  import Type = msg.Type;
  import Checkpoint = msg.Checkpoint;
  import Constructed = msg.Constructed;
  import Changed = msg.Changed;
  import Destructed = msg.Destructed;
  import Inserted = msg.Inserted;
  import Replaced = msg.Replaced;
  import Removed = msg.Removed;
  import Called = msg.Called;
  import ErrorLog = msg.ErrorLog;
  import Log = ns0.Log;
  import _level = symbolsNS._level;
  import _uid = symbolsNS._uid;

  /**
   * Core logger class. Provides the basic implementation for the logger object.
   * This interface used internally by the other core types to log some internal
   * data and could be used as a unified way to log app/process data. You may
   * extend this class, replace the default output logic and replace the default
   * implementation with the {@link setLogger} function.
   */
  export class Logger {
    private [_uid]: string;
    private [_level]: Level;
    private buffer: ns1.Buffer = ns1.buffer;

    /**
     * Unique identifier.
     */
    get uid(): string {
      return this[_uid];
    }

    /**
     * Logging level.
     * @param level Logging level.
     */
    set level(level: Level) {
      this[_level] = level;
    }

    /**
     * Logging level. This value is calculated in the runtime and depends on two
     * values: the internal logger level stored in the {@link Logger[_level]} and
     * the global logging level configurable by the {@link setLevel}. If the
     * internal level is specified and differs from {@link Level.NONE}, then
     * it will be used as a value. Otherwise, a global log level value will be
     * used.
     */
    get level(): Level {
      return this[_level] !== 0 ? this[_level] : level.get();
    }

    /**
     * Class constructor.
     * @param uid Unique identifier.
     * @param level Initial logging level ({@link Level.NONE} by default).
     */
    constructor(uid: string, level = Level.NONE) {
      this[_uid] = uid;
      this[_level] = level;
    }

    /**
     * Outputs a message at the "trace" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Message to trace.
     */
    public trace(message: any): void {
      if (message instanceof Checkpoint) {
        void this.buffer.add(
          new Log(
            this,
            thread.uid(),
            Type.checkpoint,
            Level.TRACE,
            message,
            helpers.getStack("Checkpoint"),
          ),
        );
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[key];
        void this.buffer.add(
          new Log(
            this,
            thread.uid(),
            key,
            Level.TRACE,
            val,
            helpers.getStack("Stack"),
          ),
        );
      }
    }

    /**
     * Outputs a message at the "debug" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Message to debug.
     */
    public debug(message: any): void {
      if (message instanceof Changed) {
        void this.buffer.add(
          new Log(this, thread.uid(), Type.changed, Level.DEBUG, message),
        );
      } else if (message instanceof Called) {
        void this.buffer.add(
          new Log(this, thread.uid(), Type.called, Level.DEBUG, message),
        );
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[Object.keys(msg)[0]];
        void this.buffer.add(
          new Log(this, thread.uid(), key, Level.DEBUG, val),
        );
      }
    }

    /**
     * Outputs a message at the "info" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Message to info.
     */
    public info(message: any): void {
      if (message instanceof Constructed) {
        void this.buffer.add(
          new Log(this, thread.uid(), Type.constructed, Level.INFO, message),
        );
      } else if (message instanceof Destructed) {
        void this.buffer.add(
          new Log(this, thread.uid(), Type.destructed, Level.INFO, message),
        );
      } else if (message instanceof Inserted) {
        void this.buffer.add(
          new Log(this, thread.uid(), Type.inserted, Level.INFO, message),
        );
      } else if (message instanceof Replaced) {
        void this.buffer.add(
          new Log(this, thread.uid(), Type.replaced, Level.INFO, message),
        );
      } else if (message instanceof Removed) {
        void this.buffer.add(
          new Log(this, thread.uid(), Type.removed, Level.INFO, message),
        );
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[Object.keys(msg)[0]];
        void this.buffer.add(new Log(this, thread.uid(), key, Level.INFO, val));
      }
    }

    /**
     * Outputs a message at the "warn" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Message to output.
     */
    public warn(message: any): void {
      const msg = helpers.parseMsg(message);
      const key = Object.keys(msg)[0] as Type;
      const val = msg[Object.keys(msg)[0]];
      void this.buffer.add(new Log(this, thread.uid(), key, Level.WARN, val));
    }

    /**
     * Outputs a message at the "error" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Error
     */
    public error(message: any): void {
      if (message instanceof ErrorLog) {
        void this.buffer.add(
          new Log(
            this,
            thread.uid(),
            Type.error,
            Level.ERROR,
            message,
            helpers.getStack("Error"),
          ),
        );
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[Object.keys(msg)[0]];
        void this.buffer.add(
          new Log(
            this,
            thread.uid(),
            key,
            Level.ERROR,
            val,
            helpers.getStack("Error"),
          ),
        );
      }
    }

    /**
     * Outputs a message at the "fatal" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Error
     */
    public fatal(message: any): void {
      if (message instanceof ErrorLog) {
        void this.buffer.add(
          new Log(
            this,
            thread.uid(),
            Type.error,
            Level.FATAL,
            message,
            helpers.getStack("Fatal"),
          ),
        );
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[Object.keys(msg)[0]];
        void this.buffer.add(
          new Log(
            this,
            thread.uid(),
            key,
            Level.FATAL,
            val,
            helpers.getStack("Fatal"),
          ),
        );
      }
    }
  }
}
