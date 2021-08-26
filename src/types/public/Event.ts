import EventPhase from "../../enums/EventPhase";
import getStack from "../../helpers/getStack";
import EventBinder from "../internal/EventBinder";
import Listenable from "./Listenable";

/**
 * //
 */
class Event {
  #type: string;
  #binder: EventBinder;
  #instantiation_stack: string;
  #instantiation_timestamp: number;
  #scope?: unknown;

  get type(): string {
    return this.#type;
  }

  get stack(): string {
    return this.#instantiation_stack;
  }

  get timestamp(): number {
    return this.#instantiation_timestamp;
  }

  get target(): Listenable {
    return this.#binder.target;
  }

  get current(): Listenable {
    return this.#binder.current;
  }

  get phase(): EventPhase {
    return this.#binder.phase;
  }

  get prevented(): boolean {
    return this.#binder.prevented;
  }

  get stopped(): boolean {
    return this.#binder.stopped;
  }

  get scope(): unknown {
    return this.#scope || {};
  }

  /**
   * Class constructor.
   */
  constructor(etype: string, binder: EventBinder, scope?: unknown) {
    this.#type = etype;
    this.#binder = binder;
    this.#scope = scope;
    this.#instantiation_stack = getStack("Instantiation stack");
    this.#instantiation_timestamp = Date.now();
  }

  stopPropagation(): void {
    if (!this.#binder.passive) {
      this.#binder.stopped = true;
    }
  }

  preventDefault(): void {
    if (!this.#binder.passive) {
      this.#binder.prevented = true;
    }
  }
}
export default Event;
