/**
 * @fileoverview Declaration of the state namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { helpers } from "./helpers";
import { state as ns } from "./Destructible";
export namespace state {
  export import Destructible = ns.Destructible;
  export import getInternalState = helpers.getInternalState;
  export import getAncestors = helpers.getAncestors;
}
