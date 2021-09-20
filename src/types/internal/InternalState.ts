import LogLevel from "../../enums/LogLevel";
import EventListener from "./EventListener";
import Destructible from "../public/Destructible";
import Listenable from "../public/Listenable";
import Logger from "../public/Logger";
import NodeIndex from "../internal/NodeIndex";

class InternalState {
  Logger?: typeof Logger;
  thread: null | string;
  level: LogLevel;
  undisposed: Map<string, Destructible>;
  listenersMaps: Map<Listenable, Map<string, Array<EventListener>>>;
  nodesIndices: Map<Listenable, NodeIndex>;
  constructor() {
    this.thread = null;
    this.level = LogLevel.TRACE;
    this.undisposed = new Map();
    this.listenersMaps = new Map();
    this.nodesIndices = new Map();
  }
}
export default InternalState;
