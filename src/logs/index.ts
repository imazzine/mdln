/**
 * @fileoverview Declaration of the log namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { helpers } from "./helpers";
import { thread as thrd } from "./thread";
import { level as lvl } from "./level";
import { logger as lgr } from "./logger";
import { message as msg } from "./message";
import { log as l } from "./Monitorable";

/**
 * Index logs namespace.
 */
export namespace logNS {
  export import Monitorable = l.Monitorable;
  export import message = msg;
  export import logger = lgr;
  export import thread = thrd;
  export import level = lvl;
  export import getStack = helpers.getStack;
  export import getUid = helpers.getUid;
  export import parseMsg = helpers.parseMsg;
}

/**
 * Public logs namespace.
 */
export namespace logs {
  export import getStack = helpers.getStack;
  export import getUid = helpers.getUid;
  export import setLevel = lvl.set;
  export import setLogger = lgr.setConstructor;
  export import Level = lvl.Level;
  export import Logger = lgr.Logger;
}
