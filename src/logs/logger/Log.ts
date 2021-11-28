/**
 * @fileoverview Declaration of the Log class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { symbolsNS } from "../../symbols";
import { level } from "../level";
import { message } from "../message";
import { logger as lgr } from "./Logger";
export namespace logger {
  import Level = level.Level;
  import Type = message.Type;
  import Checkpoint = message.Checkpoint;
  import Constructed = message.Constructed;
  import Changed = message.Changed;
  import Destructed = message.Destructed;
  import Inserted = message.Inserted;
  import Replaced = message.Replaced;
  import Removed = message.Removed;
  import Called = message.Called;
  import ErrorLog = message.ErrorLog;
  import Logger = lgr.Logger;
  import _logger = symbolsNS._logger;
  import _timestamp = symbolsNS._timestamp;
  import _thread = symbolsNS._thread;
  import _type = symbolsNS._type;
  import _message = symbolsNS._message;
  import _level = symbolsNS._level;
  import _stack = symbolsNS._stack;

  /**
   * Log object.
   */
  export class Log {
    private [_logger]: Logger;
    private [_timestamp]: Date = new Date();
    private [_thread]: null | string;
    private [_level]: Level;
    private [_type]: Type;
    private [_stack]: null | string;
    private [_message]:
      | undefined
      | boolean
      | number
      | string
      | Checkpoint
      | Constructed
      | Changed
      | Destructed
      | Inserted
      | Replaced
      | Removed
      | Called
      | ErrorLog;

    /**
     * Reference to the logger which populate the log.
     */
    public get logger(): Logger {
      return this[_logger];
    }

    /**
     * Log instantiation timestamp.
     */
    public get timestamp(): Date {
      return this[_timestamp];
    }

    /**
     * Log thread UUID or `null` if logger our of the thread.
     */
    public get thread(): null | string {
      return this[_thread];
    }

    /**
     * Log level.
     */
    public get level(): Level {
      return this[_level];
    }

    /**
     * Log type.
     */
    public get type(): Type {
      return this[_type];
    }

    /**
     * Log stack.
     */
    public get stack(): null | string {
      return this[_stack];
    }

    /**
     * Log
     */
    public get message():
      | undefined
      | boolean
      | number
      | string
      | Date
      | Checkpoint
      | Constructed
      | Changed
      | Destructed
      | Inserted
      | Replaced
      | Removed
      | Called
      | ErrorLog {
      return this[_message];
    }

    /**
     * @param logger Log logger.
     * @param thread Log thread uid.
     * @param type Log type.
     * @param level Log level.
     * @param message Log
     */
    public constructor(
      logger: Logger,
      thread: null | string,
      type: Type,
      level: Level,
      message:
        | undefined
        | boolean
        | number
        | string
        | Checkpoint
        | Constructed
        | Changed
        | Destructed
        | Inserted
        | Replaced
        | Removed
        | Called
        | ErrorLog,
      stack: null | string = null,
    ) {
      this[_logger] = logger;
      this[_thread] = thread;
      this[_type] = type;
      this[_level] = level;
      this[_message] = message;
      this[_stack] = stack;
    }
  }
}
