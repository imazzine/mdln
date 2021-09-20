import getInternalState from "../../helpers/getInternalState";
import ErrorsCode from "../../enums/ErrorsCode";
import ErrorsDescription from "../../enums/ErrorsDescription";
import { construct, Monitorable } from "./Monitorable";
import Logger from "./Logger";

const internal = getInternalState();
const destructing = Symbol("destructing");
const destructed = Symbol("destructed");
const destruct = Symbol("destruct");

/**
 * Class that provides destruction layer for the mdln-objects. It responds for
 * the `destruct thread`. If an instance requires cleanup, it should extends
 * this class. Examples of cleanup that can be done:
 *
 * 1. remove event listeners;
 * 2. cancel timers (setTimeout, setInterval);
 * 3. call destruct method on other destructible objects hold by current
 *    object;
 * 4. close connections (e.g. WebSockets, DB, etc.).
 *
 * Note that it's not required to delete properties or set them to null as
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
   * Determines whether the mdln-object is in the `destruct thread` or not.
   */
  get destructing(): boolean {
    return this[destructing];
  }

  /**
   * Timestamp of the mdln-object destructed moment or false, if object is not
   * destructed.
   */
  get destructed(): boolean | Date {
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
    internal.undisposed.set(this.uid, this);
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
   *
   * Classes that extend Destructible should override this method. Not
   * reentrant. To avoid calling it twice, it must only be called from the
   * subclas's symbolic [destruct] method.
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
        Logger.error(ErrorsCode.DESTRUCT_CALL, ErrorsDescription.DESTRUCT_CALL),
      );
      throw new Error(ErrorsDescription.DESTRUCT_CALL);
    } else {
      // delete object from the internal undisposed map
      internal.undisposed.delete(this.uid);
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
   * Disposes of the object. If the object hasn't already been disposed of,
   * calls {@link Disposable.$dispose}. Classes that extend Disposable
   * should override {@link Disposable.$dispose} in order to cleanup
   * references, resources and other disposable objects.
   * @throws {@link ErrorsDescription.DESTRUCT_IMPL}
   */

  /**
   * Destruct the object. If the object hasn't already been destructed, calls
   * symbolic [destruct] method to run `destruct thread`. Logs new warning
   * if object has already been destructed.
   */
  public destruct(): void {
    Logger.start_thread();
    if (this.destructed) {
      this.logger.warn(`Object{${this.uid}} is alredy destructed`);
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

      // run [construct] hierarchy
      this[destruct]();
      if (!this[destructed] || this[destructing]) {
        // TODO (buntarb): cleaning up logic here?
        this.logger.error(
          Logger.error(
            ErrorsCode.DESTRUCT_IMPL,
            ErrorsDescription.DESTRUCT_IMPL,
          ),
        );
        throw new Error(ErrorsDescription.DESTRUCT_IMPL);
      }
      this.logger.info(Logger.disposable_disposed());
    }
    Logger.stop_thread();
  }
}
export default Destructible;
export { destruct, Destructible };
