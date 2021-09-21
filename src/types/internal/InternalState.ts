/**
 * @fileoverview Declaration of the InternalState class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import LogLevel from "../../enums/LogLevel";
import Destructible from "../public/Destructible";
import Listenable from "../public/Listenable";
import Logger from "../public/Logger";
import NodeIndex from "./NodeIndex";
import EventListener from "./EventListener";

/**
 * Class that provides internal library state.
 */
class InternalState {
  /**
   * Logger constructor to use with Monitorable objects.
   */
  Logger?: typeof Logger;

  /**
   * Current thread UUID-like identifier.
   */
  thread: null | string;

  /**
   * Global logging level.
   */
  level: LogLevel;

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
    this.thread = null;
    this.level = LogLevel.TRACE;
    this.undestructed = new Map();
    this.listenersMaps = new Map();
    this.nodesIndices = new Map();
  }
}
export default InternalState;
