/**
 * @fileoverview Declaration of the Monitorable class and [construct] symbol.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import ErrorCode from "../../enums/ErrorCode";
import ErrorDescription from "../../enums/ErrorDescription";
import getUid from "../../helpers/getUid";
import getStack from "../../helpers/getStack";
import getInternalState from "../../helpers/getInternalState";
import Logger from "./Logger";

const constructing = Symbol("constructing");
const constructed = Symbol("constructed");
const uid = Symbol("uid");
const created = Symbol("created");
const stack = Symbol("stack");
const logger = Symbol("logger");
const construct = Symbol("construct");

/**
 * Class that provides the basic layer for the `mdln`-objects. It responds for
 * the `construct thread`, object uniqueness and the ability to log
 * associated with the object data. As a structure it hosts a unique object
 * identifier, object creation moment timestamp, object creation stack and
 * associated logger.
 */
class Monitorable {
  /**
   * Symbolic field for the `constructing` boolean state.
   */
  private [constructing] = false;

  /**
   * Symbolic field for the `constructed` boolean state.
   */
  private [constructed] = false;

  /**
   * Symbolic field for the object's unique UUID-like identifier.
   */
  private [uid]: string = getUid();

  /**
   * Symbolic field for the object's creation moment timestamp.
   */
  private [created]: Date = new Date();

  /**
   * Symbolic field for the object's instantiation `stack`.
   */
  private [stack]: string = getStack("Instantiation stack");

  /**
   * Symbolic field for the object's associated `logger`.
   */
  private [logger]: Logger = new (getInternalState().Logger || Logger)(
    this[uid],
  );

  /**
   * Object unique UUID-like identifier.
   */
  public get uid(): string {
    return this[uid];
  }

  /**
   * Object instantiation timestamp.
   */
  public get constructed(): Date {
    return this[created];
  }

  /**
   * Object instantiation stack.
   */
  public get stack(): string {
    return this[stack];
  }

  /**
   * Object logger.
   */
  public get logger(): Logger {
    return this[logger];
  }

  /**
   * Performs appropriate piece of the `construct thread` and logs all
   * construction related data under the same thread uid.
   *
   * Classes that extend `Monitorable` should override this method instead of add
   * any logic to the `constructor`. Not reentrant. To avoid calling it twice, it
   * must only be called from the subclas's symbolic `[construct]` method.
   *
   * @example
   * ```typescript
   * import { construct, Monitorable } from "mdln";
   *
   * class MyClass extends Monitorable {
   *   protected [construct](): void {
   *     super[construct]();
   *     // Bootstrap logic specific to MyClass.
   *   }
   * }
   * ```
   */
  protected [construct](): void {
    this.logger.trace(Logger.checkpoint("construct", "Monitorable"));
    if (this[constructed]) {
      this.logger.error(
        Logger.error(ErrorCode.CONSTRUCT_CALL, ErrorDescription.CONSTRUCT_CALL),
      );
      throw new Error(ErrorDescription.CONSTRUCT_CALL);
    } else {
      this.logger.debug(
        Logger.monitorable_changed("Monitorable", "uid", this[uid]),
      );
      this.logger.debug(
        Logger.monitorable_changed(
          "Monitorable",
          "created",
          this[created].toUTCString(),
        ),
      );
      this.logger.debug(
        Logger.monitorable_changed("Monitorable", "stack", this[stack]),
      );
      this.logger.debug(
        Logger.monitorable_changed(
          "Monitorable",
          "logger",
          getInternalState().Logger ? "inbound" : "default",
        ),
      );

      // enable construct thread
      this[constructing] = true;
      this.logger.debug(
        Logger.monitorable_changed(
          "Monitorable",
          "constructing",
          this[constructing],
        ),
      );
    }
  }

  /**
   * Constructor of the `mdln`-object. Responds for the `construct thread`
   * execution and defined in the {@link Monitorable | `Monitorable`} class.
   *
   * Classes that extend {@link Monitorable | `Monitorable`} SHOULD NOT
   * override original `constructor` method. Instead protected symbolic
   * {@link [construct] | `[construct]`} method SHOULD be used. This allows
   * to handle moments of the construction start and end and other significant
   * for the logging purposes information.
   */
  public constructor() {
    Logger.start_thread();

    // safe run [construct] hierarchy
    try {
      this[construct]();
    } finally {
      Logger.stop_thread();
    }

    if (!this[constructing]) {
      this.logger.error(
        Logger.error(ErrorCode.CONSTRUCT_IMPL, ErrorDescription.CONSTRUCT_IMPL),
      );
      Logger.stop_thread();
      throw new Error(ErrorDescription.CONSTRUCT_IMPL);
    }

    // disable construct thread
    this[constructing] = false;
    this.logger.debug(
      Logger.monitorable_changed(
        "Monitorable",
        "constructing",
        this[constructing],
      ),
    );

    // mark object as constructed
    this[constructed] = true;
    this.logger.debug(
      Logger.monitorable_changed(
        "Monitorable",
        "constructed",
        this[constructed],
      ),
    );
    this.logger.info(Logger.monitorable_constructed());
    Logger.stop_thread();
  }
}
export default Monitorable;
export { construct, Monitorable };
