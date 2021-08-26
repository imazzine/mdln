import getInternalState from "./getInternalState";
import Errors from "../enums/Errors";
import Listenable from "../types/public/Listenable";

const internal = getInternalState();

/**
 * //
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
        throw new Error(Errors.NODE_INDEX_MISSED);
      } else {
        ancestor = index.parent;
      }
    }
  }
  return ancestors;
}
export default getAncestors;
