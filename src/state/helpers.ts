/**
 * @fileoverview Declaration of the getAncestors function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors } from "../errors"
import { logNS as log } from "../logs";
import { state as ns0 } from "./InternalState";
import { state as ns1 } from "./Destructible";
export namespace helpers {
  import ErrorCode = errors.ErrorCode;
  import ErrorDescription = errors.ErrorDescription;
  import InternalState = ns0.InternalState;
  import Destructible = ns1.Destructible;

  const internal = new InternalState();

  /**
   * Returns internal state object.
   */
  export function getInternalState(): InternalState {
    return internal;
  }

  /**
   * Returns ancestors for a given mdln-object.
   */
  export function getAncestors(node: Destructible): Array<Destructible> {
    const ancestors: Array<Destructible> = [];
    let index = internal.nodes.get(node);
    if (index) {
      let ancestor = index.parent as Destructible;
      while (ancestor) {
        ancestors.push(ancestor);
        index = internal.nodes.get(ancestor);
        if (!index) {
          node.logger.error(
            log.message.getError(
              ErrorCode.NODE_INDEX_MISSED,
              ErrorDescription.NODE_INDEX_MISSED,
            ),
          );
          throw new Error(ErrorDescription.NODE_INDEX_MISSED);
        } else {
          ancestor = index.parent as Destructible;
        }
      }
    }
    return ancestors;
  }
}
