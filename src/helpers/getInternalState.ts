/**
 * @fileoverview Declaration of the getInternalState function, closure of the
 * instance of InternalState class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import InternalState from "../types/internal/InternalState";

// construct internal state object at the script evaluation phase
const internalState = new InternalState();

/**
 * Returns internal state object.
 */
function getInternalState(): InternalState {
  return internalState;
}
export default getInternalState;
