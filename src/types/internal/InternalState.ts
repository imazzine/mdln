import LogLevel from "../../enums/LogLevel";
import EventListener from "./EventListener";
import Disposable from "../public/Disposable";
import Listenable from "../public/Listenable";
import Logger from "../public/Logger";
import NodeIndex from "../internal/NodeIndex";

class InternalState {
  Logger?: typeof Logger;
  level: LogLevel;
  undisposed: Map<string, Disposable>;
  listenersMaps: Map<Listenable, Map<string, Array<EventListener>>>;
  nodesIndices: Map<Listenable, NodeIndex>;
  constructor() {
    this.level = LogLevel.INFO;
    this.undisposed = new Map();
    this.listenersMaps = new Map();
    this.nodesIndices = new Map();
  }
}
export default InternalState;
