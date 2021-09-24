/**
 * @fileoverview Declaration of the logs namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { helpers } from "./helpers";
import { thread as thrd } from "./thread";
import { level as lvl } from "./level";
import { logger as lgr } from "./logger";
import { message as msg } from "./message";

/**
 * Namespace that provides logging related types.
 */
export namespace logs {
  export import message = msg;
  export import logger = lgr;
  export import thread = thrd;
  export import level = lvl;
  export const getStack = helpers.getStack;
  export const getUid = helpers.getUid;
  export const parseMsg = helpers.parseMsg;
}
