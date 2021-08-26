import LogLevel from "../../enums/LogLevel";
import getInternalState from "../../helpers/getInternalState";

const internal = getInternalState();

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
   * @param level Message log level.
   * @param msg Message.
   */
  protected $log(level: LogLevel, msg: unknown): boolean {
    if (this.level === LogLevel.NONE) {
      return false;
    } else {
      switch (level) {
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
   * @param msg Message to output.
   */
  public trace(msg: unknown): boolean {
    return this.$log(LogLevel.TRACE, msg);
  }

  /**
   * Outputs a message at the "debug" log level. Returns
   * true if message was outputted, false otherwise.
   * @param msg Message to output.
   */
  public debug(msg: unknown): boolean {
    return this.$log(LogLevel.DEBUG, msg);
  }

  /**
   * Outputs a message at the "info" log level. Returns
   * true if message was outputted, false otherwise.
   * @param msg Message to output.
   */
  public info(msg: unknown): boolean {
    return this.$log(LogLevel.INFO, msg);
  }

  /**
   * Outputs a message at the "warn" log level. Returns
   * true if message was outputted, false otherwise.
   * @param msg Message to output.
   */
  public warn(msg: unknown): boolean {
    return this.$log(LogLevel.WARN, msg);
  }

  /**
   * Outputs a message at the "error" log level. Returns
   * true if message was outputted, false otherwise.
   * @param msg Message to output.
   */
  public error(msg: unknown): boolean {
    return this.$log(LogLevel.ERROR, msg);
  }

  /**
   * Outputs a message at the "fatal" log level. Returns
   * true if message was outputted, false otherwise.
   * @param msg Message to output.
   */
  public fatal(msg: unknown): boolean {
    return this.$log(LogLevel.FATAL, msg);
  }
}

export default Logger;
