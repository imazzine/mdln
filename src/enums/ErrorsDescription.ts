/**
 * Errors descriptions enum.
 */
enum ErrorsDescription {
  CONSTRUCT_IMPL = "super[construct] call wasn't implemented",
  CONSTRUCT_CALL = "[construct] method could not be explicitly called",
  DESTRUCT_IMPL = "super[destruct] call wasn't implemented",
  DESTRUCT_CALL = "[destruct] method could not be explicitly called",

  LISTENERS_MAP_MISSED = "Listenable internal listeners map is missed.",
  NODE_INDEX_MISSED = "Node's NodeIndex is missed.",
  NODE_MISSED_IN_CHILDREN = "Node specified as a child missed in children list.",
}
export default ErrorsDescription;
