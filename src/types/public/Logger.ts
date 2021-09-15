import LogLevel from "../../enums/LogLevel";
import LoggerDebugActions from "../../enums/LoggerDebugActions";
import LoggerInfoActions from "../../enums/LoggerInfoActions";
import LoggerTraceActions from "../../enums/LoggerTraceActions";
import getInternalState from "../../helpers/getInternalState";
import { stringify } from "uuid";

const internal = getInternalState();

interface TraceMessage {
  level: LogLevel.TRACE;
  uid: string;
  action: LoggerTraceActions;
  type: string;
  name: string;
  value: unknown;
}

interface DebugMessage {
  level: LogLevel.DEBUG;
  uid: string;
  action: LoggerDebugActions;
  type: string;
  name: string;
  value: boolean | number | string;
}

interface InfoMessage {
  level: LogLevel.INFO;
  uid: string;
  action: LoggerInfoActions;
  name: string;
  value: boolean | number | string;
}

interface WarnMessage {
  level: LogLevel.WARN;
  uid: string;
  message: string;
}

interface ErrorMessage {
  level: LogLevel.ERROR;
  uid: string;
  code: number;
  message: string;
}

interface FatalMessage {
  level: LogLevel.FATAL;
  uid: string;
  code: number;
  message: string;
}

/**
 * Core logger class. Provides the basic implementation for logger objects.
 * This interface uses internally by the other core types to log some internal
 * data and could be used as a unified way to log app/process data. The default
 * implementation uses a standard global
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Console console}
 * object to output messages. You may extend this class, replace the default
 * output logic and replace the default implementation with the
 * {@link setLogger} function.
 */
class Logger {
  #uid: string;

  /**
   * Unique identifier.
   */
  get uid(): string {
    return this.#uid;
  }

  #level: LogLevel;

  /**
   * Logging level.
   * @param level Logging level.
   */
  set level(level: LogLevel) {
    this.#level = level;
  }

  /**
   * Logging level. This value is calculated in the runtime and depends on two
   * values: the internal logger level stored in the {@link Logger.#level} and
   * the global logging level configurable by the {@link setLevel}. If the
   * internal level is specified and differs from {@link LogLevel.NONE}, then
   * it will be used as a value. Otherwise, a global log level value will be
   * used.
   */
  get level(): LogLevel {
    return this.#level !== 0 ? this.#level : internal.level;
  }

  /**
   * Class constructor.
   * @param uid Unique identifier.
   * @param level Initial logging level ({@link LogLevel.NONE} by default).
   */
  constructor(uid: string, level = LogLevel.NONE) {
    this.#uid = uid;
    this.#level = level;
  }

  /**
   * Performs logging operations. This method is called from the Logger's
   * public methods (i.e. {@link Logger.error}, {@link Logger.info}, etc.) and
   * should not be explicitly called. Classes that extend Logger should
   * override this method in order to provide a logging mechanism other than
   * predefined default.
   *
   * @param msg Message to log.
   */
  protected $_log(
    msg:
      | TraceMessage
      | DebugMessage
      | InfoMessage
      | WarnMessage
      | ErrorMessage
      | FatalMessage,
  ): boolean {
    if (this.level === LogLevel.NONE) {
      return false;
    } else {
      switch (msg.level) {
        case LogLevel.TRACE:
          if (this.level == LogLevel.TRACE) {
            console.trace(msg);
            return true;
          }
          break;
        case LogLevel.DEBUG:
          if (this.level <= LogLevel.DEBUG) {
            console.debug(msg);
            return true;
          }
          break;
        case LogLevel.INFO:
          if (this.level <= LogLevel.INFO) {
            console.info(msg);
            return true;
          }
          break;
        case LogLevel.WARN:
          if (this.level <= LogLevel.WARN) {
            console.warn(msg);
            return true;
          }
          break;
        case LogLevel.ERROR:
          if (this.level <= LogLevel.ERROR) {
            console.error(msg);
            return true;
          }
          break;
        case LogLevel.FATAL:
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
   * @param action Traceable action.
   * @param type Traceable type.
   * @param name Traceable key name.
   * @param value Traceable key value.
   */
  public trace(
    action: LoggerTraceActions,
    type: string,
    name: string,
    value: unknown,
  ): boolean {
    if (action === LoggerTraceActions.LOG_STRINGLIFIED) {
      value = JSON.stringify(value);
    }
    return this.$_log({
      level: LogLevel.TRACE,
      action: action,
      uid: this.uid,
      type: type,
      name: name,
      value: value,
    });
  }

  /**
   * Outputs a message at the "debug" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param action Debuggable action.
   * @param type Debuggable type.
   * @param name Debuggable key name.
   * @param value Debuggable key value.
   */
  public debug(
    action: LoggerDebugActions,
    type: string,
    name: string,
    value: boolean | number | string,
  ): boolean {
    return this.$_log({
      level: LogLevel.DEBUG,
      action: action,
      uid: this.uid,
      type: type,
      name: name,
      value: value,
    });
  }

  /**
   * Outputs a message at the "info" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param action Logable action.
   * @param name Logable key name.
   * @param value Logable key value.
   */
  public info(
    action: LoggerInfoActions,
    name: string,
    value: boolean | number | string,
  ): boolean {
    return this.$_log({
      level: LogLevel.INFO,
      action: action,
      uid: this.uid,
      name: name,
      value: value,
    });
  }

  /**
   * Outputs a message at the "warn" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param msg Message to output.
   */
  public warn(msg: string): boolean {
    return this.$_log({
      level: LogLevel.WARN,
      uid: this.uid,
      message: msg,
    });
  }

  /**
   * Outputs a message at the "error" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param code Error code.
   * @param msg Message to output.
   */
  public error(code: number, msg: string): boolean {
    return this.$_log({
      level: LogLevel.ERROR,
      uid: this.uid,
      code: code,
      message: msg,
    });
  }

  /**
   * Outputs a message at the "fatal" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param code Error code.
   * @param msg Message to output.
   */
  public fatal(code: number, msg: string): boolean {
    return this.$_log({
      level: LogLevel.FATAL,
      uid: this.uid,
      code: code,
      message: msg,
    });
  }
}

export default Logger;
