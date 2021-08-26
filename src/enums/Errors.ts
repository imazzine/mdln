/**
 * Errors messages enums.
 */
enum Errors {
  MANUAL_CALL = "Disposable.$dispose() method should not be explicitly called. Use Disposable.dispose() instead.",
  BROKEN_CHAIN = "super.$dispose() was not called in the overridden method.",
  LISTENERS_MAP_MISSED = "Listenable internal listeners map is missed.",
  NODE_INDEX_MISSED = "Node's NodeIndex is missed.",
  NODE_MISSED_IN_CHILDREN = "Node specified as a child missed in children list.",
}
export default Errors;
