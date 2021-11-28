/**
 * @fileoverview Declaration of the Error class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { symbolsNS } from "../symbols";
import { errors as ns0 } from "./Code";
import { errors as ns1 } from "./Description";
export namespace errors {
  import _code = symbolsNS._code;
  import Code = ns0.Code;
  import Description = ns1.Description;

  /**
   * `mln`-errors class.
   * Extend regular `Error` but mixing `code`-logic into it.
   */
  export class mln_Error extends Error {
    private [_code]: Code;
    public get code(): Code {
      return this[_code];
    }
    public constructor(code: Code, description: Description) {
      super(`[mln-${code}] ${description}`);
      this[_code] = code;
    }
  }
}
