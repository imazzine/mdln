/**
 * @fileoverview Declaration of the Destructible class and [destruct] symbol.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { symbols } from "../symbols";
import { errors } from "../errors";
import { logNS as log } from "../logs";
import { helpers } from "./helpers";
export namespace state {
  import ErrorCode = errors.ErrorCode;
  import ErrorDescription = errors.ErrorDescription;
  import Monitorable = log.Monitorable;
  import construct = symbols.construct;
  import destruct = symbols.destruct;

  const internal = helpers.getInternalState();
  const _destructing = Symbol("_destructing");
  const _destructed = Symbol("_destructed");

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
   * 4. close connections (e.g. `WebSockets`, `DataBase`, etc.).
   *
   * Note that it's not required to delete properties or set them to `null` as
   * garbage collector will collect them assuming that references to current
   * object will be lost after it is destructed.
   */
  export class Destructible extends Monitorable {
    /**
     * Symbolic field for the `_destructing` boolean state.
     */
    private [_destructing] = false;

    /**
     * Symbolic field for the `_destructed` property.
     */
    private [_destructed]: boolean | Date = false;

    /**
     * Timestamp of the object destruction moment or false, if object is not
     * destructed.
     */
    public get destructed(): boolean | Date {
      return this[_destructed];
    }

    /**
     * @override
     */
    protected [construct](): void {
      super[construct]();
      this.logger.trace(log.message.getCheckpoint("construct", "Destructible"));
      this.logger.debug(
        log.message.getChanged(
          "Destructible",
          "_destructed",
          this[_destructed],
        ),
      );
      this.logger.debug(
        log.message.getChanged(
          "Destructible",
          "_destructing",
          this[_destructing],
        ),
      );

      // add object to the internal undisposed map
      internal.undestructed.set(this.uid, this);
      this.logger.debug(
        log.message.getCalled(
          "internal.undisposed",
          "Map",
          "set",
          [this.uid, `{${this.uid}}`],
          true,
        ),
      );
    }

    /**
     * Performs appropriate piece of the `destruct thread` and log all
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
      this.logger.trace(log.message.getCheckpoint("destruct", "Destructible"));
      if (!this[_destructing]) {
        this.logger.error(
          log.message.getError(ErrorCode.DESTRUCT_CALL, ErrorDescription.DESTRUCT_CALL),
        );
        throw new Error(ErrorDescription.DESTRUCT_CALL);
      } else {
        // delete object from the internal undisposed map
        internal.undestructed.delete(this.uid);
        this.logger.debug(
          log.message.getCalled(
            "internal.undisposed",
            "Map",
            "delete",
            [this.uid],
            true,
          ),
        );

        // disable destruct thread
        this[_destructing] = false;
        this.logger.debug(
          log.message.getChanged(
            "Destructible",
            "_destructing",
            this[_destructing],
          ),
        );

        // set destructed timestamp
        this[_destructed] = new Date();
        this.logger.debug(
          log.message.getChanged(
            "Destructible",
            "_destructed",
            this[_destructed],
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
      log.thread.start();
      if (this.destructed) {
        this.logger.warn(`{${this.uid}} is alredy destructed`);
      } else {
        // enable destruct thread
        this[_destructing] = true;
        this.logger.debug(
          log.message.getChanged(
            "Destructible",
            "_destructing",
            this[_destructing],
          ),
        );

        // safe run [destruct] hierarchy
        try {
          this[destruct]();
        } finally {
          log.thread.stop();
        }

        // assert destruct result
        if (!this[_destructed] || this[_destructing]) {
          // TODO (buntarb): cleaning up/restore state here?
          this.logger.error(
            log.message.getError(ErrorCode.DESTRUCT_IMPL, ErrorDescription.DESTRUCT_IMPL),
          );
          log.thread.stop();
          throw new Error(ErrorDescription.DESTRUCT_IMPL);
        }
        this.logger.info(log.message.getDestructed());
      }
      log.thread.stop();
    }
  }
}
