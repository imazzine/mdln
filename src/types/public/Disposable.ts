import getInternalState from "../../helpers/getInternalState";
import Errors from "../../enums/Errors";
import Monitorable from "./Monitorable";
import Logger from "./Logger";
const internal = getInternalState();

/**
 * Class that provides the basic implementation for disposable objects. If an
 * instance requires cleanup, it should extends this class. Examples of cleanup
 * that can be done in $dispose method:
 *
 * 1. Remove event listeners.
 * 2. Cancel timers (setTimeout, setInterval).
 * 3. Call dispose on other disposable objects hold by current object.
 * 4. Close connections (e.g. WebSockets).
 *
 * Note that it's not required to delete properties (e.g. DOM nodes) or set
 * them to null as garbage collector will collect them assuming that references
 * to current object will be lost after it is disposed.
 */
class Disposable extends Monitorable {
  #_disposed: number;

  /**
   * Timestamp of the disposing moment, represented in milliseconds elapsed
   * since the UNIX epoch. Equal to 0 if instance is not disposed.
   */
  get disposed(): number {
    return this.#_disposed;
  }

  #_disposing: boolean;

  /**
   * Whether the object is in the disposing state.
   * @internal
   */
  get disposing(): boolean {
    return this.#_disposing;
  }

  /**
   * Class constructor.
   */
  constructor() {
    super();
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Disposable/constructor", "start"),
    );

    this.#_disposed = 0;
    this.logger.debug(
      Logger.monitorable_changed("Disposable", "#_disposed", this.#_disposed),
    );

    this.#_disposing = false;
    this.logger.debug(
      Logger.monitorable_changed("Disposable", "#_disposing", this.#_disposing),
    );

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

    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Disposable/constructor", "exit"),
    );
  }

  /**
   * Performs appropriate cleanup. Classes that extend Disposable should
   * override this method. Not reentrant. To avoid calling it twice, it must
   * only be called from the subclas's $dispose method. Everywhere else
   * the public {@link Disposable.dispose} method must be used, throw an error
   * otherwise.
   * @throws {@link Errors.MANUAL_CALL}
   * @example
   * ```
   * class MyClass extends Disposable {
   *   constructor() {
   *     super();
   *   }
   *   $dispose(): void {
   *     // Dispose logic specific to MyClass.
   *     ...
   *     // Call superclass's $dispose at the end of the subclass's,
   *     // like in C++, to avoid hard-to-catch issues.
   *     super.$dispose();
   *   }
   * }
   * ```
   */
  protected $_dispose(): void {
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Disposable/$_dispose", "start"),
    );

    if (this.disposing) {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Disposable/$_dispose",
          "disposing",
        ),
      );

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

      this.#_disposing = false;
      this.logger.debug(
        Logger.monitorable_changed(
          "Disposable",
          "#_disposing",
          this.#_disposing,
        ),
      );

      this.#_disposed = Date.now();
      this.logger.debug(
        Logger.monitorable_changed("Disposable", "#_disposed", this.#_disposed),
      );
    } else {
      this.logger.error(Logger.error(1, Errors.MANUAL_CALL));
      throw new Error(Errors.MANUAL_CALL);
    }
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Disposable/$_dispose", "end"),
    );
  }

  /**
   * Disposes of the object. If the object hasn't already been disposed of,
   * calls {@link Disposable.$dispose}. Classes that extend Disposable
   * should override {@link Disposable.$dispose} in order to cleanup
   * references, resources and other disposable objects.
   * @throws {@link Errors.BROKEN_CHAIN}
   */
  dispose(): void {
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Disposable/dispose", "start"),
    );

    if (this.disposed === 0) {
      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Disposable/dispose",
          "disposing sequence start",
        ),
      );

      this.#_disposing = true;
      this.logger.debug(
        Logger.monitorable_changed(
          "Disposable",
          "#_disposing",
          this.#_disposing,
        ),
      );

      this.$_dispose();

      this.logger.trace(
        Logger.checkpoint(
          "mdln/types/public/Disposable/dispose",
          "disposing sequence end",
        ),
      );

      if (this.disposed === 0 || this.disposing) {
        this.logger.error(Logger.error(1, Errors.BROKEN_CHAIN));
        throw new Error(Errors.BROKEN_CHAIN);
      }

      this.logger.info(Logger.disposable_disposed());
    } else {
      this.logger.warn(`{${this.uid}} is alredy disposed`);
    }
    this.logger.trace(
      Logger.checkpoint("mdln/types/public/Disposable/dispose", "end"),
    );
  }
}
export default Disposable;
