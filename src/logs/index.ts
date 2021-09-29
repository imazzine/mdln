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
  export import Log = lgr.Log;
  export import Type = msg.Type;
  export import Level = lvl.Level;
  export import Logger = lgr.Logger;
  export import Buffer = lgr.Buffer;
  export import Monitorable = l.Monitorable;
  export import setLevel = lvl.set;
  export import getUid = helpers.getUid;
  export import getStack = helpers.getStack;
  export import setBuffer = lgr.setBuffer;

  export import getCheckpoint = msg.getCheckpoint;
  export import getChanged = msg.getChanged;
  export import getCalled = msg.getCalled;
  export import getError = msg.getError;

  // /**
  //  * Namespace for {@link Log.message | Log#message} public types getters.
  //  */
  // export const message = {
  //   getCheckpoint: msg.getCheckpoint,
  //   getChanged: msg.getChanged,
  //   getCalled: msg.getCalled,
  //   getError: msg.getError,
  // };
}
