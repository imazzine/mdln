/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { logs as l } from "./Monitorable";

/**
 * Index logs namespace.
 */
export namespace logNS {
  export import undestructed = l.undestructed;
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
  export import Log = lgr.Log;
  export import Type = msg.Type;
  export import Level = lvl.Level;
  export import Logger = lgr.Logger;
  export import Buffer = lgr.Buffer;
  export import Monitorable = l.Monitorable;
  export import getCalled = msg.getCalled;
  export import getChanged = msg.getChanged;
  export import getCheckpoint = msg.getCheckpoint;
  export import getError = msg.getError;
  export import getStack = helpers.getStack;
  export import getUid = helpers.getUid;
  export import setBuffer = lgr.setBuffer;
  export import setLevel = lvl.set;
}
