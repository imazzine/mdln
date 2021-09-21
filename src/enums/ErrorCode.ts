/**
 * Errors messages codes enum.
 */
enum ErrorCode {
  CONSTRUCT_IMPL = 1,
  CONSTRUCT_CALL = 2,
  DESTRUCT_IMPL = 3,
  DESTRUCT_CALL = 4,

  LISTENERS_MAP_MISSED = 5,

  NODE_INDEX_MISSED = 6,
  NODE_CHILD_MISSED = 7,
}
export default ErrorCode;
