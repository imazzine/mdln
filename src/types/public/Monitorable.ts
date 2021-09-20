/**
 * @fileoverview Declaration of the Monitorable class and [construct] symbol.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import ErrorsCode from "../../enums/ErrorsCode";
import ErrorsDescription from "../../enums/ErrorsDescription";
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
 * Class that provides the basic layer for the mdln-objects. It responds for
 * the contruction thread, object's uniqueness and the ability to log
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
   * Symbolic field for the object's instantiation stack.
   */
  private [stack]: string = getStack("Instantiation stack");

  /**
   * Symbolic field for the object's associated logger.
   */
  private [logger]: Logger = new (getInternalState().Logger || Logger)(
    this[uid],
  );

  /**
   * Determines whether the mdln-object is in the construction thread or not.
   */
  public get constructing(): boolean {
    return this[constructing];
  }

  /**
   * Determines whether the mdln-object is already constructed or not.
   */
  public get constructed(): boolean {
    return this[constructed];
  }

  /**
   * Object's unique UUID-like identifier getter.
   */
  public get uid(): string {
    return this[uid];
  }

  /**
   * Object's creation moment timestamp getter.
   */
  public get created(): Date {
    return this[created];
  }

  /**
   * Object's instantiation stack getter.
   */
  public get stack(): string {
    return this[stack];
  }

  /**
   * Object's associated logger getter.
   */
  public get logger(): Logger {
    return this[logger];
  }

  /**
   * Performs appropriate piece of the `construct thread` and logs all
   * construction related data under the same thread uid.
   *
   * Classes that extend Monitorable should override this method instead of add
   * any logic to the constructor. Not reentrant. To avoid calling it twice, it
   * must only be called from the subclas's symbolic [construct] method.
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
        Logger.error(
          ErrorsCode.CONSTRUCT_CALL,
          ErrorsDescription.CONSTRUCT_CALL,
        ),
      );
      throw new Error(ErrorsDescription.CONSTRUCT_CALL);
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
   * Enable/disable "construct thread" for the mdln-object.
   *
   * This is the only constructor from the mdln-hierarchy types which hold any
   * type of logic. Rest of the mdln-types provides their bootstrapping logic
   * using `construct thread` - protected symbolic [construct] method. This
   * allows us to indirectly handle moments of the construction start and
   * construction end, which is important for the logging.
   */
  public constructor() {
    Logger.start_thread();

    // run [construct] hierarchy
    this[construct]();
    if (!this[constructing]) {
      this.logger.error(
        Logger.error(
          ErrorsCode.CONSTRUCT_IMPL,
          ErrorsDescription.CONSTRUCT_IMPL,
        ),
      );
      throw new Error(ErrorsDescription.CONSTRUCT_IMPL);
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
