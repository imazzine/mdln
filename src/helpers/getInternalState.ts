import InternalState from "../types/internal/InternalState";

const internalState = new InternalState();

function getInternalState(): InternalState {
  return internalState;
}
export default getInternalState;
