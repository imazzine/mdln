/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @fileoverview Declaration of the errors namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors as ns0 } from "./Code";
import { errors as ns1 } from "./Description";
import { errors as ns2 } from "./Error";

/**
 * Namespace that provides errors related types.
 */
export namespace errors {
  export import Code = ns0.Code;
  export import Description = ns1.Description;
  export import Error = ns2.mln_Error;
}
