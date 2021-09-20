import EventPhase from "../../enums/EventPhase";
import getStack from "../../helpers/getStack";
import EventBinder from "../internal/EventBinder";
import Logger from "./Logger";
import Listenable from "./Listenable";

/**
 * //
 */
class Event {
  #_type: string;
  #_binder: EventBinder;
  #_stack: string;
  #_created: Date;
  #_scope?: unknown;

  get type(): string {
    return this.#_type;
  }

  get stack(): string {
    return this.#_stack;
  }

  get created(): Date {
    return this.#_created;
  }

  get target(): Listenable {
    return this.#_binder.target;
  }

  get current(): Listenable {
    return this.#_binder.current;
  }

  get phase(): EventPhase {
    return this.#_binder.phase;
  }

  get prevented(): false | Date {
    return this.#_binder.prevented;
  }

  get stopped(): false | Date {
    return this.#_binder.stopped;
  }

  get scope(): unknown {
    return this.#_scope || null;
  }

  /**
   * Class constructor.
   */
  constructor(etype: string, binder: EventBinder, scope?: unknown) {
    this.#_type = etype;
    this.#_binder = binder;
    this.#_scope = scope;
    this.#_stack = getStack("Instantiation stack");
    this.#_created = new Date();
  }

  stop(): void {
    if (!this.#_binder.passive) {
      this.#_binder.stopped = new Date();
      this.target.logger.debug(
        Logger.variable_changed(`binder`, "EventBinder", "stopped", [
          this.#_binder.stopped.toUTCString(),
        ]),
      );
    } else {
      this.target.logger.warn("stop() ignored for passive event");
    }
  }

  prevent(): void {
    if (!this.#_binder.passive) {
      this.#_binder.prevented = new Date();
      this.target.logger.debug(
        Logger.variable_changed(`binder`, "EventBinder", "prevented", [
          this.#_binder.prevented.toUTCString(),
        ]),
      );
    } else {
      this.target.logger.warn("prevent() ignored for passive event");
    }
  }
}
export default Event;
