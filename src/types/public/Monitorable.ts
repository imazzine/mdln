import getUid from "../../helpers/getUid";
import getStack from "../../helpers/getStack";
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
  #uid: string;

  /**
   * Unique UUID-like identifier.
   */
  get uid(): string {
    return this.#uid;
  }

  /**
   * Instantiation timestamp.
   */
  #created: number;

  /**
   * Instantiation timestamp.
   */
  get created(): number {
    return this.#created;
  }

  /**
   * Instance logger.
   */
  #logger: Logger;

  /**
   * Instance logger.
   */
  get logger(): Logger {
    return this.#logger;
  }

  /**
   * Instantiation stack.
   */
  #stack: string;

  /**
   * Instantiation stack.
   */
  get stack(): string {
    return this.#stack;
  }

  /**
   * Class constructor.
   */
  constructor() {
    this.#uid = getUid();
    this.#created = Date.now();
    this.#stack = getStack("Instantiation stack");
    this.#logger = new Logger(this.#uid);
  }
}

export default Monitorable;
