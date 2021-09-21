/**
 * @fileoverview Declaration of the getAncestors function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import ErrorCode from "../enums/ErrorCode";
import ErrorDescription from "../enums/ErrorDescription";
import Listenable from "../types/public/Listenable";
import Logger from "../types/public/Logger";
import getInternalState from "./getInternalState";

const internal = getInternalState();

/**
 * Returns ancestors for a given mdln-object.
 */
function getAncestors(node: Listenable): Array<Listenable> {
  const ancestors: Array<Listenable> = [];
  let index = internal.nodesIndices.get(node);
  if (index) {
    let ancestor = index.parent;
    while (ancestor) {
      ancestors.push(ancestor);
      index = internal.nodesIndices.get(ancestor);
      if (!index) {
        node.logger.error(
          Logger.error(
            ErrorCode.NODE_INDEX_MISSED,
            ErrorDescription.NODE_INDEX_MISSED,
          ),
        );
        throw new Error(ErrorDescription.NODE_INDEX_MISSED);
      } else {
        ancestor = index.parent;
      }
    }
  }
  return ancestors;
}
export default getAncestors;
