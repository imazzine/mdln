/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @fileoverview Declaration of the msg namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { helpers } from "../helpers";
import { message as ns0 } from "./Type";
import { message as ns1 } from "./Checkpoint";
import { message as ns2 } from "./Constructed";
import { message as ns3 } from "./Changed";
import { message as ns4 } from "./Destructed";
import { message as ns5 } from "./Inserted";
import { message as ns6 } from "./Replaced";
import { message as ns7 } from "./Removed";
import { message as ns8 } from "./Called";
import { message as ns9 } from "./Error";
import { message as ns10 } from "./Log";
export namespace message {
  export import Type = ns0.Type;
  export import Checkpoint = ns1.Checkpoint;
  export import Constructed = ns2.Constructed;
  export import Changed = ns3.Changed;
  export import Destructed = ns4.Destructed;
  export import Inserted = ns5.Inserted;
  export import Replaced = ns6.Replaced;
  export import Removed = ns7.Removed;
  export import Called = ns8.Called;
  export import ErrorLog = ns9.ErrorLog;
  export import Log = ns10.Log;

  /**
   * Returns Checkpoint log message object.
   * @param name Checkpoint name.
   * @param value Checkpoint value.
   */
  export const getCheckpoint = (name: string, value: string): Checkpoint => {
    return new Checkpoint(name, value);
  };

  /**
   * Returns Constructed log message object.
   */
  export const getConstructed = (): Constructed => {
    return new Constructed();
  };

  /**
   * Returns Changed log message object.
   * @param level Name of the class where this function called from.
   * @param field Name of the changed propery.
   * @param value Value of the property.
   */
  export const getChanged = (
    level: string,
    field: string,
    value: unknown,
  ): Changed => {
    const msg = helpers.parseMsg(value);
    const key = Object.keys(msg)[0] as Type;
    const val = msg[key];
    return new Changed(level, field, val);
  };

  /**
   * Returns Destructed log message object.
   */
  export const getDestructed = (): Destructed => {
    return new Destructed();
  };

  /**
   * Returns Inserted log message object.
   * @param child Inserted node.
   * @param before Before reference node.
   */
  export const getInserted = (child: string, before?: string): Inserted => {
    return new Inserted(child, before);
  };

  /**
   * Returns Replaced log message object.
   * @param existing Replaced node.
   * @param to New node.
   */
  export const getReplaced = (existing: string, to: string): Replaced => {
    return new Replaced(existing, to);
  };

  /**
   * Returns Removed log message object.
   * @param child Removed node.
   */
  export const getRemoved = (child: string): Removed => {
    return new Removed(child);
  };

  /**
   * Returns Called log message object.
   * @param name Variable name.
   * @param type Variable type.
   * @param method Called method.
   * @param args Argumants array.
   * @param global Whether changed variable global or not.
   * @returns
   */
  export const getCalled = (
    name: string,
    type: string,
    method: string,
    args: Array<unknown>,
    global = false,
  ): Called => {
    const res: Array<boolean | number | string> = [];
    args.forEach((value) => {
      const msg = helpers.parseMsg(value);
      const val = msg[Object.keys(msg)[0]];
      res.push(val);
    });
    return new Called(name, type, method, res, global);
  };

  /**
   * Returns ErrorLog log message object.
   * @param code Error code.
   * @param msg Error
   */
  export const getError = (code: number, msg: string): ErrorLog => {
    return new ErrorLog(code, msg);
  };
}
