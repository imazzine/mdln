import getUid from "../../helpers/getUid";
import getStack from "../../helpers/getStack";
import getInternalState from "../../helpers/getInternalState";
import Logger from "./Logger";

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
    this.#_logger.trace(
      Logger.checkpoint("mdln/types/public/Monitorable/constructor", "start"),
    );

    this.logger.debug(
      Logger.monitorable_changed("Monitorable", "#_uid", this.#_uid),
    );
    this.logger.debug(
      Logger.monitorable_changed(
        "Monitorable",
        "#_logger",
        getInternalState().Logger ? "inbound" : "default",
      ),
    );

    this.#_created = Date.now();
    this.logger.debug(
      Logger.monitorable_changed("Monitorable", "#_created", this.#_created),
    );

    this.#_stack = getStack("Instantiation stack");
    this.logger.debug(
      Logger.monitorable_changed("Monitorable", "#_stack", this.#_stack),
    );

    this.logger.info(Logger.monitorable_constructed());

    this.#_logger.trace(
      Logger.checkpoint("mdln/types/public/Monitorable/constructor", "end"),
    );
  }
}

export default Monitorable;
