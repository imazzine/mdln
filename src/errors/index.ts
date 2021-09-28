/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @fileoverview Declaration of the errors namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors as ns0 } from "./ErrorCode";
import { errors as ns1 } from "./ErrorDescription";

/**
 * Namespace that provides errors related types.
 */
export namespace errors {
  export import ErrorCode = ns0.ErrorCode;
  export import ErrorDescription = ns1.ErrorDescription;
}
