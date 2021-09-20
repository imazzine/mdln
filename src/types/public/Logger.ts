import getUid from "../../helpers/getUid";
import LogLevel from "../../enums/LogLevel";
import getInternalState from "../../helpers/getInternalState";

const internal = getInternalState();

class Checkpoint {
  label: string;
  point: string;
  constructor(label: string, point: string) {
    this.label = label;
    this.point = point;
  }
}

class MonitorableConstructed {
  //
}

class MonitorableChanged {
  level: string;
  field: string;
  value: boolean | number | string;
  constructor(level: string, field: string, value: boolean | number | string) {
    this.level = level;
    this.field = field;
    this.value = value;
  }
}

class DisposableDisposed {
  //
}

class NodeInserted {
  child: string;
  before?: string;
  constructor(child: string, before?: string) {
    this.child = child;
    this.before = before;
  }
}

class NodeReplaced {
  existing: string;
  to: string;
  constructor(existing: string, to: string) {
    this.existing = existing;
    this.to = to;
  }
}

class NodeRemoved {
  child: string;
  constructor(child: string) {
    this.child = child;
  }
}

class VariableChanged {
  name: string;
  type: string;
  method: string;
  args: Array<boolean | number | string>;
  global: boolean;
  constructor(
    name: string,
    type: string,
    method: string,
    args: Array<boolean | number | string>,
    global = false,
  ) {
    this.name = name;
    this.type = type;
    this.method = method;
    this.args = args;
    this.global = global;
  }
}

class ErrorLog {
  code: number;
  message: string;
  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

enum MessageType {
  undefined = "undefined",
  symbol = "symbol",
  boolean = "boolean",
  number = "number",
  bigint = "bigint",
  string = "string",
  function = "function",
  object = "object",
  checkpoint = "checkpoint",
  monitorable_constructed = "monitorable_constructed",
  monitorable_changed = "monitorable_changed",
  disposable_disposed = "disposable_disposed",
  node_inserted = "node_inserted",
  node_replaced = "node_replaced",
  node_removed = "node_removed",
  variable_changed = "variable_changed",
  error = "error",
}

class Message {
  #_thread: null | string;
  #_logger: string;
  #_level: LogLevel;
  #_type: MessageType;
  #_message:
    | boolean
    | number
    | string
    | Checkpoint
    | MonitorableConstructed
    | MonitorableChanged
    | DisposableDisposed
    | NodeInserted
    | NodeReplaced
    | NodeRemoved
    | VariableChanged
    | ErrorLog;

  get thread(): null | string {
    return this.#_thread;
  }

  get logger(): string {
    return this.#_logger;
  }

  get level(): LogLevel {
    return this.#_level;
  }

  get type(): MessageType {
    return this.#_type;
  }

  get message():
    | boolean
    | number
    | string
    | Checkpoint
    | MonitorableConstructed
    | MonitorableChanged
    | DisposableDisposed
    | NodeInserted
    | NodeReplaced
    | NodeRemoved
    | VariableChanged
    | ErrorLog {
    return this.#_message;
  }

  constructor(
    logger: string,
    type: MessageType,
    level: LogLevel,
    message:
      | boolean
      | number
      | string
      | Checkpoint
      | MonitorableConstructed
      | MonitorableChanged
      | DisposableDisposed
      | NodeInserted
      | NodeReplaced
      | NodeRemoved
      | VariableChanged
      | ErrorLog,
  ) {
    this.#_thread = internal.thread;
    this.#_logger = logger;
    this.#_type = type;
    this.#_level = level;
    this.#_message = message;
  }
}

function parseMessage(
  message: undefined | symbol | boolean | bigint | number | string | unknown,
): { [type: string]: boolean | number | string } {
  switch (typeof message) {
    case "undefined":
      return { [MessageType.undefined]: MessageType.undefined };
    case "symbol":
      return { [MessageType.symbol]: MessageType.symbol };
    case "bigint":
      return { [MessageType.bigint]: message.toString() };
    case "boolean":
      return { [MessageType.boolean]: message };
    case "number":
      return { [MessageType.number]: message };
    case "string":
      return { [MessageType.string]: message };
    case "function":
      return { [MessageType.function]: message.toString() };
    case "object":
      try {
        return { [MessageType.object]: JSON.stringify(message) };
      } catch (err) {
        return message
          ? { [MessageType.object]: message.toString() }
          : { [MessageType.object]: "null" };
      }
  }
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
  public static get thread(): null | string {
    return internal.thread;
  }

  public static start_thread(): void {
    internal.thread = getUid();
  }

  public static stop_thread(): void {
    internal.thread = null;
  }

  public static checkpoint = function (
    flow: string,
    point: string,
  ): Checkpoint {
    return new Checkpoint(flow, point);
  };

  public static monitorable_constructed(): MonitorableConstructed {
    return new MonitorableConstructed();
  }

  public static monitorable_changed(
    level: string,
    field: string,
    value: any,
  ): MonitorableChanged {
    const msg = parseMessage(value);
    const key = Object.keys(msg)[0] as MessageType;
    const val = msg[key];
    return new MonitorableChanged(level, field, val);
  }

  public static disposable_disposed(): DisposableDisposed {
    return new DisposableDisposed();
  }

  public static node_inserted(child: string, before?: string): NodeInserted {
    return new NodeInserted(child, before);
  }

  public static node_replaced(existing: string, to: string): NodeReplaced {
    return new NodeReplaced(existing, to);
  }

  public static node_removed(child: string): NodeRemoved {
    return new NodeRemoved(child);
  }

  public static variable_changed(
    name: string,
    type: string,
    method: string,
    args: Array<any>,
    global = false,
  ): VariableChanged {
    const res: Array<boolean | number | string> = [];
    args.forEach((value) => {
      const msg = parseMessage(value);
      const val = msg[Object.keys(msg)[0]];
      res.push(val);
    });
    return new VariableChanged(name, type, method, res, global);
  }

  public static error(code: number, message: string): ErrorLog {
    return new ErrorLog(code, message);
  }

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
  protected $_log(msg: Message): boolean {
    if (this.level === LogLevel.NONE) {
      return false;
    } else {
      switch (msg.level) {
        case LogLevel.TRACE:
          if (this.level == LogLevel.TRACE) {
            console.log(msg);
            return true;
          }
          break;
        case LogLevel.DEBUG:
          if (this.level <= LogLevel.DEBUG) {
            console.log(msg);
            return true;
          }
          break;
        case LogLevel.INFO:
          if (this.level <= LogLevel.INFO) {
            console.log(msg);
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
   * @param message Message to trace.
   */
  public trace(message: any): boolean {
    if (message instanceof Checkpoint) {
      return this.$_log(
        new Message(this.uid, MessageType.checkpoint, LogLevel.TRACE, message),
      );
    } else {
      const msg = parseMessage(message);
      const key = Object.keys(msg)[0] as MessageType;
      const val = msg[key];
      return this.$_log(new Message(this.uid, key, LogLevel.TRACE, val));
    }
  }

  /**
   * Outputs a message at the "debug" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param message Message to debug.
   */
  public debug(message: any): boolean {
    if (message instanceof MonitorableChanged) {
      return this.$_log(
        new Message(
          this.uid,
          MessageType.monitorable_changed,
          LogLevel.DEBUG,
          message,
        ),
      );
    }
    if (message instanceof VariableChanged) {
      return this.$_log(
        new Message(
          this.uid,
          MessageType.variable_changed,
          LogLevel.DEBUG,
          message,
        ),
      );
    } else {
      const msg = parseMessage(message);
      const key = Object.keys(msg)[0] as MessageType;
      const val = msg[Object.keys(msg)[0]];
      return this.$_log(new Message(this.uid, key, LogLevel.DEBUG, val));
    }
  }

  /**
   * Outputs a message at the "info" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param message Message to info.
   */
  public info(message: any): boolean {
    if (message instanceof MonitorableConstructed) {
      return this.$_log(
        new Message(
          this.uid,
          MessageType.monitorable_constructed,
          LogLevel.INFO,
          message,
        ),
      );
    }
    if (message instanceof DisposableDisposed) {
      return this.$_log(
        new Message(
          this.uid,
          MessageType.disposable_disposed,
          LogLevel.INFO,
          message,
        ),
      );
    }
    if (message instanceof NodeInserted) {
      return this.$_log(
        new Message(
          this.uid,
          MessageType.node_inserted,
          LogLevel.INFO,
          message,
        ),
      );
    }
    if (message instanceof NodeReplaced) {
      return this.$_log(
        new Message(
          this.uid,
          MessageType.node_replaced,
          LogLevel.INFO,
          message,
        ),
      );
    }
    if (message instanceof NodeRemoved) {
      return this.$_log(
        new Message(this.uid, MessageType.node_removed, LogLevel.INFO, message),
      );
    } else {
      const msg = parseMessage(message);
      const key = Object.keys(msg)[0] as MessageType;
      const val = msg[Object.keys(msg)[0]];
      return this.$_log(new Message(this.uid, key, LogLevel.INFO, val));
    }
  }

  /**
   * Outputs a message at the "warn" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param message Message to output.
   */
  public warn(message: any): boolean {
    const msg = parseMessage(message);
    const key = Object.keys(msg)[0] as MessageType;
    const val = msg[Object.keys(msg)[0]];
    return this.$_log(new Message(this.uid, key, LogLevel.WARN, val));
  }

  /**
   * Outputs a message at the "error" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param message Error message.
   */
  public error(message: any): boolean {
    if (message instanceof ErrorLog) {
      return this.$_log(
        new Message(this.uid, MessageType.error, LogLevel.ERROR, message),
      );
    } else {
      const msg = parseMessage(message);
      const key = Object.keys(msg)[0] as MessageType;
      const val = msg[Object.keys(msg)[0]];
      return this.$_log(new Message(this.uid, key, LogLevel.ERROR, val));
    }
  }

  /**
   * Outputs a message at the "fatal" log level. Returns
   * true if message was outputted, false otherwise.
   *
   * @param message Error message.
   */
  public fatal(message: any): boolean {
    if (message instanceof ErrorLog) {
      return this.$_log(
        new Message(this.uid, MessageType.error, LogLevel.FATAL, message),
      );
    } else {
      const msg = parseMessage(message);
      const key = Object.keys(msg)[0] as MessageType;
      const val = msg[Object.keys(msg)[0]];
      return this.$_log(new Message(this.uid, key, LogLevel.FATAL, val));
    }
  }
}
export default Logger;
