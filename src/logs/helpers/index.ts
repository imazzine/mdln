/**
 * @fileoverview Declaration of the helpers namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { helpers as ns0 } from "./parseMsg";
import { helpers as ns1 } from "./getUid";
import { helpers as ns2 } from "./getStack";

/**
 * Helper functions namespace.
 */
export namespace helpers {
  export import parseMsg = ns0.parseMsg;
  export import getUid = ns1.getUid;
  export import getStack = ns2.getStack;
};
