/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @fileoverview Declaration of the logger constructor logic.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { logger as ns1 } from "./Log";
import { logger as ns0 } from "./Logger";
import { logger as ns2 } from "./Buffer";
export namespace logger {
  export import Log = ns1.Log;
  export import Logger = ns0.Logger;
  export import Buffer = ns2.Buffer;
  export import setBuffer = ns2.setBuffer;
}
