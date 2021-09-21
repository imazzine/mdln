/**
 * Errors descriptions enum.
 */
enum ErrorDescription {
  CONSTRUCT_IMPL = "super[construct] call wasn't implemented",
  CONSTRUCT_CALL = "[construct] method could not be explicitly called",
  DESTRUCT_IMPL = "super[destruct] call wasn't implemented",
  DESTRUCT_CALL = "[destruct] method could not be explicitly called",

  LISTENERS_MAP_MISSED = "Listenable internal listeners map is missed.",
  NODE_INDEX_MISSED = "index is missed for a given node",
  NODE_CHILD_MISSED = "given child is missed in node's children list",
}
export default ErrorDescription;
