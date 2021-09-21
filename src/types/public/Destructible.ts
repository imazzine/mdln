/**
 * @fileoverview Declaration of the Destructible class and [destruct] symbol.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import ErrorCode from "../../enums/ErrorCode";
import ErrorDescription from "../../enums/ErrorDescription";
import getInternalState from "../../helpers/getInternalState";
import { construct, Monitorable } from "./Monitorable";
import Logger from "./Logger";

const internal = getInternalState();
const destructing = Symbol("destructing");
const destructed = Symbol("destructed");
const destruct = Symbol("destruct");

/**
 * Class that provides destruction layer for the `mdln`-objects. It responds for
 * the object `destruct thread`.
 *
 * As a structure it does not provide any additional public properties.
 *
 * Examples of cleanup that can be done:
 *
 * 1. remove event listeners;
 * 2. cancel timers (`setTimeout`, `setInterval`);
 * 3. call `destruct` method on other destructible objects hold by current;
 * 4. close connections (e.g. `WebSockets`, `DB`, etc.).
 *
 * Note that it's not required to delete properties or set them to `null` as
 * garbage collector will collect them assuming that references to current
 * object will be lost after it is destructed.
 */
class Destructible extends Monitorable {
  /**
   * Symbolic field for the `destructing` boolean state.
   */
  private [destructing] = false;

  /**
   * Symbolic field for the `destructed` property.
   */
  private [destructed]: boolean | Date = false;

  /**
   * Timestamp of the object destruction moment or false, if object is not
   * destructed.
   */
  public get destructed(): boolean | Date {
    return this[destructed];
  }

  /**
   * @override
   */
  protected [construct](): void {
    super[construct]();
    this.logger.trace(Logger.checkpoint("construct", "Destructible"));
    this.logger.debug(
      Logger.monitorable_changed(
        "Destructible",
        "destructed",
        this[destructed],
      ),
    );
    this.logger.debug(
      Logger.monitorable_changed(
        "Destructible",
        "destructing",
        this[destructing],
      ),
    );

    // add object to the internal undisposed map
    internal.undestructed.set(this.uid, this);
    this.logger.debug(
      Logger.variable_changed(
        "internal.undisposed",
        "Map",
        "set",
        [this.uid, `{${this.uid}}`],
        true,
      ),
    );
  }

  /**
   * Performs appropriate piece of the `destruct thread` and logs all
   * destruction related data under the same thread uid.
   *
   * Classes that extend `Destructible` should override this method. Not
   * reentrant. To avoid calling it twice, it must only be called from the
   * subclass's symbolic `[destruct]` method.
   *
   * @example
   * ```typescript
   * import { destruct, Destructible } from "mdln";
   *
   * class MyClass extends Destructible {
   *   protected [destruct](): void {
   *     // Destruct logic specific to MyClass.
   *     // ...
   *     // Call superclass's [destruct] at the end of the subclass's, like in
   *     // C++, to avoid hard-to-catch issues.
   *     super[destruct]();
   *   }
   * }
   * ```
   */
  protected [destruct](): void {
    this.logger.trace(Logger.checkpoint("destruct", "Destructible"));
    if (!this[destructing]) {
      this.logger.error(
        Logger.error(ErrorCode.DESTRUCT_CALL, ErrorDescription.DESTRUCT_CALL),
      );
      throw new Error(ErrorDescription.DESTRUCT_CALL);
    } else {
      // delete object from the internal undisposed map
      internal.undestructed.delete(this.uid);
      this.logger.debug(
        Logger.variable_changed(
          "internal.undisposed",
          "Map",
          "delete",
          [this.uid],
          true,
        ),
      );

      // disable destruct thread
      this[destructing] = false;
      this.logger.debug(
        Logger.monitorable_changed(
          "Destructible",
          "destructing",
          this[destructing],
        ),
      );

      // set destructed timestamp
      this[destructed] = new Date();
      this.logger.debug(
        Logger.monitorable_changed(
          "Destructible",
          "destructed",
          this[destructed],
        ),
      );
    }
  }

  /**
   * Destruct the `mdln`-object. If the object hasn't already been destructed, calls
   * symbolic {@link [destruct] | `[destruct]`} method to start the
   * `destruct thread`. Logs new warning if object has already been destructed.
   */
  public destruct(): void {
    Logger.start_thread();
    if (this.destructed) {
      this.logger.warn(`{${this.uid}} is alredy destructed`);
    } else {
      // enable destruct thread
      this[destructing] = true;
      this.logger.debug(
        Logger.monitorable_changed(
          "Destructible",
          "destructing",
          this[destructing],
        ),
      );

      // safe run [destruct] hierarchy
      try {
        this[destruct]();
      } finally {
        Logger.stop_thread();
      }

      // assert destruct result
      if (!this[destructed] || this[destructing]) {
        // TODO (buntarb): cleaning up/restore state here?
        this.logger.error(
          Logger.error(ErrorCode.DESTRUCT_IMPL, ErrorDescription.DESTRUCT_IMPL),
        );
        Logger.stop_thread();
        throw new Error(ErrorDescription.DESTRUCT_IMPL);
      }
      this.logger.info(Logger.disposable_disposed());
    }
    Logger.stop_thread();
  }
}
export default Destructible;
export { destruct, Destructible };
