/**
 * @fileoverview Declaration of the Log class for logs namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { level } from "../level";
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

import Level = level.Level;
import Type = ns0.Type;
import Checkpoint = ns1.Checkpoint;
import Constructed = ns2.Constructed;
import Changed = ns3.Changed;
import Destructed = ns4.Destructed;
import Inserted = ns5.Inserted;
import Replaced = ns6.Replaced;
import Removed = ns7.Removed;
import Called = ns8.Called;
import ErrorLog = ns9.ErrorLog;

const _timestamp = Symbol("_timestamp");
const _thread = Symbol("_thread");
const _type = Symbol("_type");
const _message = Symbol("_message");
const _level = Symbol("_level");

export namespace message {
  /**
   * Log object.
   */
  export class Log {
    private [_timestamp]: Date = new Date();
    private [_thread]: null | string;
    private [_level]: Level;
    private [_type]: Type;
    private [_message]:
      | boolean
      | number
      | string
      | Checkpoint
      | Constructed
      | Changed
      | Destructed
      | Inserted
      | Replaced
      | Removed
      | Called
      | ErrorLog;

    /**
    * Log instantiation timestamp.
    */
    public get timestamp(): Date {
      return this[_timestamp];
    }

    /**
    * Log thread UUID or `null` if logger our of the thread.
    */
    public get thread(): null | string {
      return this[_thread];
    }

    /**
    * Log level.
    */
    public get level(): Level {
      return this[_level];
    }

    /**
    * Log type.
    */
    public get type(): Type {
      return this[_type];
    }

    /**
    * Log
    */
    public get message():
      | boolean
      | number
      | string
      | Checkpoint
      | Constructed
      | Changed
      | Destructed
      | Inserted
      | Replaced
      | Removed
      | Called
      | ErrorLog {
      return this[_message];
    }

    /**
    * @param type Log type.
    * @param level Log level.
    * @param message Log
    */
    public constructor(
      thread: null | string,
      type: Type,
      level: Level,
      message:
        | boolean
        | number
        | string
        | Checkpoint
        | Constructed
        | Changed
        | Destructed
        | Inserted
        | Replaced
        | Removed
        | Called
        | ErrorLog,
    ) {
      this[_thread] = thread;
      this[_type] = type;
      this[_level] = level;
      this[_message] = message;
    }
  }
}
