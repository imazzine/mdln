import getUid from "../../helpers/getUid";
import getStack from "../../helpers/getStack";
import getInternalState from "../../helpers/getInternalState";
import LoggerDebugActions from "../../enums/LoggerDebugActions";
import LoggerInfoActions from "../../enums/LoggerInfoActions";
import Logger from "./Logger";
import LoggerTraceActions from "src/enums/LoggerTraceActions";

/**
 * Class that provides the basic implementation for monitorable objects.
 * Instance of this class has unique identifier, instantiation stack,
 * instantiation timestamp and associated logger. This is the base class of
 * inheritance hierarchy of the core components. In this hierarchy it responds
 * for the uniqueness of every created node.
 */
class Monitorable {
  /**
   * Unique UUID-like identifier.
   */
  #_uid: string;

  /**
   * Unique UUID-like identifier.
   */
  get uid(): string {
    return this.#_uid;
  }

  /**
   * Instantiation timestamp.
   */
  #_created: number;

  /**
   * Instantiation timestamp.
   */
  get created(): number {
    return this.#_created;
  }

  /**
   * Instance logger.
   */
  #_logger: Logger;

  /**
   * Instance logger.
   */
  get logger(): Logger {
    return this.#_logger;
  }

  /**
   * Instantiation stack.
   */
  #_stack: string;

  /**
   * Instantiation stack.
   */
  get stack(): string {
    return this.#_stack;
  }

  /**
   * Class constructor.
   */
  constructor() {
    this.#_uid = getUid();
    this.#_logger = new (getInternalState().Logger || Logger)(this.#_uid);

    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Monitorable",
      "contructor",
      "entry",
    );
    this.logger.debug(
      LoggerDebugActions.INSTANCE_CHANGED,
      "Monitorable",
      "#_uid",
      this.#_uid,
    );
    this.logger.debug(
      LoggerDebugActions.INSTANCE_CHANGED,
      "Monitorable",
      "#_logger",
      getInternalState().Logger ? "inbound" : "default",
    );

    this.#_created = Date.now();
    this.logger.debug(
      LoggerDebugActions.INSTANCE_CHANGED,
      "Monitorable",
      "#_created",
      this.#_created,
    );

    this.#_stack = getStack("Instantiation stack");
    this.logger.debug(
      LoggerDebugActions.INSTANCE_CHANGED,
      "Monitorable",
      "#_stack",
      this.#_stack,
    );

    this.logger.info(
      LoggerInfoActions.INSTANCE_CONSTRUCTED,
      "Monitorable",
      this.#_uid,
    );

    this.logger.trace(
      LoggerTraceActions.TRACE_CHECKPOINT,
      "Monitorable",
      "contructor",
      "exit",
    );
  }
}

export default Monitorable;
