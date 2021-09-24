/**
 * @fileoverview Declaration of the Monitorable class and [construct] symbol.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors } from "../../errors"
import { logs } from "../../logs";
import { symbols } from "../../symbols";

import ErrorCode = errors.ErrorCode;
import ErrorDescription = errors.ErrorDescription;

import getUid = logs.getUid;
import getStack = logs.getStack;

import construct = symbols.construct;

const _constructing = Symbol("_constructing");
const _constructed = Symbol("_constructed");
const _uid = Symbol("_uid");
const _created = Symbol("_created");
const _stack = Symbol("_stack");
const _logger = Symbol("_logger");

/**
 * Class that provides the basic layer for the `mdln`-objects. It responds for
 * the `construct thread`, object uniqueness and the ability to log
 * associated with the object data. As a structure it hosts a unique object
 * identifier, object creation moment timestamp, object creation stack and
 * associated logger.
 */
class Monitorable {
  /**
   * Symbolic field for the `_constructing` boolean state.
   */
  private [_constructing] = false;

  /**
   * Symbolic field for the `_constructed` boolean state.
   */
  private [_constructed] = false;

  /**
   * Symbolic field for the object's unique UUID-like identifier.
   */
  private [_uid]: string = getUid();

  /**
   * Symbolic field for the object's creation moment timestamp.
   */
  private [_created]: Date = new Date();

  /**
   * Symbolic field for the object's instantiation `_stack`.
   */
  private [_stack]: string = getStack("Instantiation stack");

  /**
   * Symbolic field for the object's associated `_logger`.
   */
  private [_logger]: logs.logger.Logger = new (logs.logger.getConstructor())(this[_uid]);

  /**
   * Object unique UUID-like identifier.
   */
  public get uid(): string {
    return this[_uid];
  }

  /**
   * Object instantiation timestamp.
   */
  public get constructed(): Date {
    return this[_created];
  }

  /**
   * Object instantiation stack.
   */
  public get stack(): string {
    return this[_stack];
  }

  /**
   * Object logger.
   */
  public get logger(): logs.logger.Logger {
    return this[_logger];
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
    this.logger.trace(logs.message.getCheckpoint("construct", "Monitorable"));
    if (this[_constructed]) {
      this.logger.error(
        logs.message.getError(ErrorCode.CONSTRUCT_CALL, ErrorDescription.CONSTRUCT_CALL),
      );
      throw new Error(ErrorDescription.CONSTRUCT_CALL);
    } else {
      this.logger.debug(
        logs.message.getChanged("Monitorable", "_uid", this[_uid]),
      );
      this.logger.debug(
        logs.message.getChanged(
          "Monitorable",
          "_created",
          this[_created].toUTCString(),
        ),
      );
      this.logger.debug(
        logs.message.getChanged("Monitorable", "_stack", this[_stack]),
      );
      this.logger.debug(
        logs.message.getChanged(
          "Monitorable",
          "_logger",
          logs.logger.isUpdated()  ? "updated" : "default",
        ),
      );

      // enable construct thread
      this[_constructing] = true;
      this.logger.debug(
        logs.message.getChanged(
          "Monitorable",
          "_constructing",
          this[_constructing],
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
    logs.thread.start();

    // safe run [construct] hierarchy
    try {
      this[construct]();
    } finally {
      logs.thread.stop();
    }

    if (!this[_constructing]) {
      this.logger.error(
        logs.message.getError(ErrorCode.CONSTRUCT_IMPL, ErrorDescription.CONSTRUCT_IMPL),
      );
      logs.thread.stop();
      throw new Error(ErrorDescription.CONSTRUCT_IMPL);
    }

    // disable construct thread
    this[_constructing] = false;
    this.logger.debug(
      logs.message.getChanged(
        "Monitorable",
        "_constructing",
        this[_constructing],
      ),
    );

    // mark object as constructed
    this[_constructed] = true;
    this.logger.debug(
      logs.message.getChanged(
        "Monitorable",
        "_constructed",
        this[_constructed],
      ),
    );
    this.logger.info(logs.message.getConstructed());
    logs.thread.stop();
  }
}
export default Monitorable;
