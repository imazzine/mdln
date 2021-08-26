import getInternalState from "../../helpers/getInternalState";
import Errors from "../../enums/Errors";
import Monitorable from "./Monitorable";

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
  #disposed: number;

  /**
   * Timestamp of the disposing moment, represented in milliseconds elapsed
   * since the UNIX epoch. Equal to 0 if instance is not disposed.
   */
  get disposed(): number {
    return this.#disposed;
  }

  #disposing: boolean;

  /**
   * Whether the object is in the disposing state.
   * @internal
   */
  get disposing(): boolean {
    return this.#disposing;
  }

  /**
   * Class constructor.
   */
  constructor() {
    super();
    this.#disposed = 0;
    this.#disposing = false;
    internal.undisposed.set(this.uid, this);
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
  protected $dispose(): void {
    if (this.disposing) {
      internal.undisposed.delete(this.uid);
      this.#disposing = false;
      this.#disposed = Date.now();
    } else {
      throw new Error(Errors.MANUAL_CALL);
    }
  }

  /**
   * Disposes of the object. If the object hasn't already been disposed of,
   * calls {@link Disposable.$dispose}. Classes that extend Disposable
   * should override {@link Disposable.$dispose} in order to cleanup
   * references, resources and other disposable objects.
   * @throws {@link Errors.BROKEN_CHAIN}
   */
  dispose(): void {
    if (this.disposed === 0) {
      this.#disposing = true;
      this.$dispose();
      if (this.disposed === 0 || this.disposing) {
        throw new Error(Errors.BROKEN_CHAIN);
      }
    }
  }
}
export default Disposable;
