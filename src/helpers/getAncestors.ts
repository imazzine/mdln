import getInternalState from "./getInternalState";
import ErrorsCode from "../enums/ErrorsCode";
import ErrorsDescription from "../enums/ErrorsDescription";
import Listenable from "../types/public/Listenable";
import Logger from "../types/public/Logger";

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
        node.logger.error(
          Logger.error(
            ErrorsCode.NODE_INDEX_MISSED,
            ErrorsDescription.NODE_INDEX_MISSED,
          ),
        );
        throw new Error(ErrorsDescription.NODE_INDEX_MISSED);
      } else {
        ancestor = index.parent;
      }
    }
  }
  return ancestors;
}
export default getAncestors;
