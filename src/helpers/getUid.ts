import { v1, v5 } from "uuid";
import Event from "../types/public/Event";

const ns = "00000000-0000-0000-0000-000000000000";
const stringsMap: Map<string, string> = new Map();
const callbacksMap: Map<(event: Event) => void, string> = new Map();

/**
 * Returns random session unique UUID-like string.
 */
function getUid(value?: string | ((event: Event) => void)): string {
  if (value) {
    if (typeof value === "string") {
      if (!stringsMap.has(value)) {
        stringsMap.set(value, v5(value, ns).toString());
      }
      return stringsMap.get(value) as string;
    }
    if (typeof value === "function") {
      if (!callbacksMap.has(value)) {
        callbacksMap.set(value, v5(value.toString(), ns).toString());
      }
      return callbacksMap.get(value) as string;
    }
  }
  return v5(v1(), v1()).toString();
}
export default getUid;
