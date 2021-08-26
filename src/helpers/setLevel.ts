import getInternalState from "./getInternalState";
import LogLevel from "../enums/LogLevel";

const internal = getInternalState();

/**
 * Configures logging level in the runtime. Each particular logger could be
 * reconfigured independently by changing {@link Logger.level}. Could be
 * called in the runtime any number of times.
 * @param level Logging level.
 */
function setLevel(level: LogLevel): void {
  internal.level = level;
}
export default setLevel;
