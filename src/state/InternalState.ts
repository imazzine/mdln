/**
 * @fileoverview Declaration of the InternalState class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { state as ns } from "./Destructible";
import Destructible = ns.Destructible;
export namespace state {
  /**
   * Class that provides internal library state.
   */
  export class InternalState {
    /**
     * Map of the undestructed destructable objects.
     */
    undestructed: Map<string, Destructible>;

    /**
     * Map of the listenable object listeners maps.
     */
    listeners: Map<Destructible, Map<string, Array<unknown>>>;

    /**
     * Map of the nodes indexes.
     */
    nodes: Map<Destructible, {parent?: Destructible, children: Array<Destructible>}>;

    /**
     * Class constructor.
     */
    constructor() {
      this.undestructed = new Map();
      this.listeners = new Map();
      this.nodes = new Map();
    }
  }
}
