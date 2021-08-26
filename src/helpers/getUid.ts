import { v1, v5 } from "uuid";

/**
 * Returns random session unique UUID-like string.
 */
function getUid(): string {
  return v5(v1(), v1()).toString();
}
export default getUid;
