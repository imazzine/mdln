/**
 * @fileoverview Declaration of the InternalState class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import Destructible from "../public/Destructible";
import Listenable from "../public/Listenable";
import NodeIndex from "./NodeIndex";
import EventListener from "./EventListener";

/**
 * Class that provides internal library state.
 */
class InternalState {
  /**
   * Map of the undestructed destructable objects.
   */
  undestructed: Map<string, Destructible>;

  /**
   * Map of the listenable object listeners maps.
   */
  listenersMaps: Map<Listenable, Map<string, Array<EventListener>>>;

  /**
   * Map of the nodes indexes.
   */
  nodesIndices: Map<Listenable, NodeIndex>;

  /**
   * Class constructor.
   */
  constructor() {
    this.undestructed = new Map();
    this.listenersMaps = new Map();
    this.nodesIndices = new Map();
  }
}
export default InternalState;
