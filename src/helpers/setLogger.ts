import getInternalState from "./getInternalState";
import Logger from "../types/public/Logger";

/**
 * Configuring {@link Logger} implementation to use in the runtime.
 * @param LoggerConstructor Logger constructor function.
 */
function setLogger(LoggerConstructor: typeof Logger): void {
  getInternalState().Logger = LoggerConstructor;
}
export default setLogger;
