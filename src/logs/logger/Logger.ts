/**
 * @fileoverview Declaration of the Logger class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { symbols } from "../../symbols";
import { helpers } from "../helpers";
import { thread } from "../thread";
import { level } from "../level";
import { message as msg } from "../message";

import log = symbols.log;

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
import Log = msg.Log;

/**
 * Log message namespace.
 */
export namespace logger {
  // symbols for private properties
  const _level = Symbol("_level");
  const _uid = Symbol("_uid");

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
     * Performs logging operations. This method is called from the Logger's
     * public methods (i.e. {@link Logger.error}, {@link Logger.info}, etc.) and
     * should not be explicitly called. Classes that extend Logger should
     * override this method in order to provide a logging mechanism other than
     * predefined default.
     *
     * @param msg Log object.
     */
    protected [log](msg: Log): boolean {
      if (this.level === Level.NONE) {
        return false;
      } else {
        switch (msg.level) {
          case Level.TRACE:
            if (this.level == Level.TRACE) {
              console.log(msg);
              return true;
            }
            break;
          case Level.DEBUG:
            if (this.level <= Level.DEBUG) {
              console.log(msg);
              return true;
            }
            break;
          case Level.INFO:
            if (this.level <= Level.INFO) {
              console.log(msg);
              return true;
            }
            break;
          case Level.WARN:
            if (this.level <= Level.WARN) {
              console.warn(msg);
              return true;
            }
            break;
          case Level.ERROR:
            if (this.level <= Level.ERROR) {
              console.error(msg);
              return true;
            }
            break;
          case Level.FATAL:
            console.error(msg);
            return true;
        }
        return false;
      }
    }

    /**
     * Outputs a message at the "trace" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Message to trace.
     */
    public trace(message: any): boolean {
      if (message instanceof Checkpoint) {
        return this[log](
          new Log(
            thread.uid(),
            Type.checkpoint,
            Level.TRACE,
            message)
        );
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[key];
        return this[log](new Log(thread.uid(), key, Level.TRACE, val));
      }
    }

    /**
     * Outputs a message at the "debug" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Message to debug.
     */
    public debug(message: any): boolean {
      if (message instanceof Changed) {
        return this[log](
          new Log(thread.uid(), Type.changed, Level.DEBUG, message),
        );
      }
      if (message instanceof Called) {
        return this[log](
          new Log(thread.uid(), Type.called, Level.DEBUG, message),
        );
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[Object.keys(msg)[0]];
        return this[log](new Log(thread.uid(), key, Level.DEBUG, val));
      }
    }

    /**
     * Outputs a message at the "info" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Message to info.
     */
    public info(message: any): boolean {
      if (message instanceof Constructed) {
        return this[log](
          new Log(thread.uid(), Type.constructed, Level.INFO, message),
        );
      }
      if (message instanceof Destructed) {
        return this[log](
          new Log(thread.uid(), Type.destructed, Level.INFO, message),
        );
      }
      if (message instanceof Inserted) {
        return this[log](
          new Log(thread.uid(), Type.inserted, Level.INFO, message),
        );
      }
      if (message instanceof Replaced) {
        return this[log](
          new Log(thread.uid(), Type.replaced, Level.INFO, message),
        );
      }
      if (message instanceof Removed) {
        return this[log](new Log(thread.uid(), Type.removed, Level.INFO, message));
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[Object.keys(msg)[0]];
        return this[log](new Log(thread.uid(), key, Level.INFO, val));
      }
    }

    /**
     * Outputs a message at the "warn" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Message to output.
     */
    public warn(message: any): boolean {
      const msg = helpers.parseMsg(message);
      const key = Object.keys(msg)[0] as Type;
      const val = msg[Object.keys(msg)[0]];
      return this[log](new Log(thread.uid(), key, Level.WARN, val));
    }

    /**
     * Outputs a message at the "error" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Error
     */
    public error(message: any): boolean {
      if (message instanceof ErrorLog) {
        return this[log](new Log(thread.uid(), Type.error, Level.ERROR, message));
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[Object.keys(msg)[0]];
        return this[log](new Log(thread.uid(), key, Level.ERROR, val));
      }
    }

    /**
     * Outputs a message at the "fatal" log level. Returns
     * true if message was outputted, false otherwise.
     *
     * @param message Error
     */
    public fatal(message: any): boolean {
      if (message instanceof ErrorLog) {
        return this[log](new Log(thread.uid(), Type.error, Level.FATAL, message));
      } else {
        const msg = helpers.parseMsg(message);
        const key = Object.keys(msg)[0] as Type;
        const val = msg[Object.keys(msg)[0]];
        return this[log](new Log(thread.uid(), key, Level.FATAL, val));
      }
    }
  }
}
