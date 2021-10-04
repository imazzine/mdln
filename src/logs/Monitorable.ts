/**
 * @fileoverview Declaration of the Monitorable class and [construct] symbol.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors } from "../errors";
import { symbolsNS } from "../symbols";
import { helpers } from "./helpers";
import { logger } from "./logger";
import { message } from "./message";
import { thread } from "./thread";
export namespace logs {
  import _constructing = symbolsNS._constructing;
  import _constructed = symbolsNS._constructed;
  import _destructing = symbolsNS._destructing;
  import _destructed = symbolsNS._destructed;
  import _uid = symbolsNS._uid;
  import _created = symbolsNS._created;
  import _stack = symbolsNS._stack;
  import _logger = symbolsNS._logger;
  import construct = symbolsNS.construct;
  import destruct = symbolsNS.destruct;
  import getUid = helpers.getUid;
  import getStack = helpers.getStack;

  /**
   * Map of the undestructed destructable objects.
   */
  export const undestructed: Map<string, Monitorable> = new Map();

  /**
   * Class that provides the basic layer for the `mdln`-objects. It responds for
   * the `construct thread`, object uniqueness and the ability to log
   * associated with the object data. As a structure it hosts a unique object
   * identifier, object creation moment timestamp, object creation stack and
   * associated logger.
   */
  export class Monitorable {
    /**
     * Symbolic field for the `_constructing` boolean state.
     */
    private [_constructing]: boolean;

    /**
     * Symbolic field for the `_constructed` boolean state.
     */
    private [_constructed]: boolean;

    /**
     * Symbolic field for the `_destructing` boolean state.
     */
    private [_destructing]: boolean;

    /**
     * Symbolic field for the `_destructed` property.
     */
    private [_destructed]: boolean | Date;

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
    private [_logger]: logger.Logger = new logger.Logger(this[_uid]);

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
     * Timestamp of the object destruction moment or false, if object is not
     * destructed.
     */
    public get destructed(): boolean | Date {
      return this[_destructed];
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
    public get logger(): logger.Logger {
      return this[_logger];
    }

    /**
     * Performs appropriate piece of the `construct thread` and log all
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
      if (this[_constructed]) {
        this.logger.error(
          message.getError(
            errors.Code.CONSTRUCT_CALL,
            errors.Description.CONSTRUCT_CALL,
          ),
        );
        throw new errors.Error(
          errors.Code.CONSTRUCT_CALL,
          errors.Description.CONSTRUCT_CALL,
        );
      } else {
        // run construct thread
        this[_constructing] = true;
        this.logger.debug(
          message.getChanged(
            "Monitorable",
            "_constructing",
            this[_constructing],
          ),
        );
        this[_destructing] = false;
        this.logger.debug(
          message.getChanged("Monitorable", "_destructing", this[_destructing]),
        );
        this[_destructed] = false;
        this.logger.debug(
          message.getChanged("Monitorable", "_destructed", this[_destructed]),
        );
        // add object to the undestructed map
        undestructed.set(this.uid, this);
        this.logger.debug(
          message.getCalled(
            "undestructed",
            "Map",
            "set",
            [this.uid, `{${this.uid}}`],
            true,
          ),
        );
      }
    }

    /**
     * Performs appropriate piece of the `destruct thread` and log all
     * destruction related data under the same thread uid.
     *
     * Classes that extend `Monitorable` should override this method. Not
     * reentrant. To avoid calling it twice, it must only be called from the
     * subclass's symbolic `[destruct]` method.
     *
     * @example
     * ```typescript
     * import { destruct, Monitorable } from "mdln";
     *
     * class MyClass extends Monitorable {
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
      this.logger.trace(message.getCheckpoint("destruct", "Monitorable"));
      if (!this[_destructing]) {
        this.logger.error(
          message.getError(
            errors.Code.DESTRUCT_CALL,
            errors.Description.DESTRUCT_CALL,
          ),
        );
        throw new errors.Error(
          errors.Code.DESTRUCT_CALL,
          errors.Description.DESTRUCT_CALL,
        );
      } else {
        // delete object from the internal undestructed map
        undestructed.delete(this.uid);
        this.logger.debug(
          message.getCalled("undestructed", "Map", "delete", [this.uid], true),
        );
        this[_destructing] = false;
        this.logger.debug(
          message.getChanged(
            "Destructible",
            "_destructing",
            this[_destructing],
          ),
        );
        this[_destructed] = new Date();
        this.logger.debug(
          message.getChanged("Destructible", "_destructed", this[_destructed]),
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
      thread.start();
      this.logger.trace(message.getCheckpoint("construct", "Monitorable"));
      this.logger.debug(message.getChanged("Monitorable", "_uid", this[_uid]));
      this.logger.debug(
        message.getChanged("Monitorable", "_created", this[_created]),
      );
      this.logger.debug(
        message.getChanged("Monitorable", "_stack", this[_stack]),
      );
      this.logger.debug(
        message.getChanged("Monitorable", "_logger", `{logger[${this[_uid]}]}`),
      );

      // safe run [construct] hierarchy
      try {
        this[_constructed] = false;
        this.logger.debug(
          message.getChanged("Monitorable", "_constructed", this[_constructed]),
        );
        this[construct]();
      } finally {
        if (!this[_constructing]) {
          this.logger.error(
            message.getError(
              errors.Code.CONSTRUCT_IMPL,
              errors.Description.CONSTRUCT_IMPL,
            ),
          );
          thread.stop();
          // eslint-disable-next-line no-unsafe-finally
          throw new errors.Error(
            errors.Code.CONSTRUCT_IMPL,
            errors.Description.CONSTRUCT_IMPL,
          );
        }

        // disable construct thread
        this[_constructing] = false;
        this.logger.debug(
          message.getChanged(
            "Monitorable",
            "_constructing",
            this[_constructing],
          ),
        );

        // mark object as constructed
        this[_constructed] = true;
        this.logger.debug(
          message.getChanged("Monitorable", "_constructed", this[_constructed]),
        );
        this.logger.info(message.getConstructed());
        thread.stop();
      }
    }

    /**
     * Destruct the `mdln`-object. If the object hasn't already been destructed, calls
     * symbolic {@link [destruct] | `[destruct]`} method to start the
     * `destruct thread`. Logs new warning if object has already been destructed.
     */
    public destructor(): void {
      thread.start();
      if (this.destructed) {
        this.logger.warn(`{${this.uid}} is alredy destructed`);
      } else {
        // enable destruct thread
        this[_destructing] = true;
        this.logger.debug(
          message.getChanged(
            "Destructible",
            "_destructing",
            this[_destructing],
          ),
        );

        // safe run [destruct] hierarchy
        try {
          this[destruct]();
        } finally {
          thread.stop();
        }

        // assert destruct result
        if (!this[_destructed] || this[_destructing]) {
          // TODO (buntarb): cleaning up/restore state here?
          this.logger.error(
            message.getError(
              errors.Code.DESTRUCT_IMPL,
              errors.Description.DESTRUCT_IMPL,
            ),
          );
          thread.stop();
          throw new errors.Error(
            errors.Code.DESTRUCT_IMPL,
            errors.Description.DESTRUCT_IMPL,
          );
        }
        this.logger.info(message.getDestructed());
      }
      thread.stop();
    }
  }
}
