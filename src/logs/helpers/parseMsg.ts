/**
 * @fileoverview Declaration of the parseMsg function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { message as msg } from "../message";
export namespace helpers {
  /**
   * Parse user's message to primitive value and returns an object with the
   * key equal to the final message type and value equal to the converted
   * message.
   *
   * @param message Message to parse.
   */
  export function parseMsg(
    message: undefined | symbol | boolean | bigint | number | string | unknown,
  ): { [type: string]: boolean | number | string | Date } {
    switch (typeof message) {
      case "undefined":
        return { [msg.Type.undefined]: msg.Type.undefined };
      case "symbol":
        return { [msg.Type.symbol]: msg.Type.symbol };
      case "bigint":
        return { [msg.Type.bigint]: message.toString() };
      case "boolean":
        return { [msg.Type.boolean]: message };
      case "number":
        return { [msg.Type.number]: message };
      case "string":
        return { [msg.Type.string]: message };
      case "function":
        return { [msg.Type.function]: message.toString() };
      case "object":
        if (message instanceof Date) {
          return { [msg.Type.date]: message };
        } else {
          try {
            return { [msg.Type.object]: JSON.stringify(message) };
          } catch (err) {
            return message
              ? { [msg.Type.object]: message.toString() }
              : { [msg.Type.object]: "null" };
          }
        }
    }
  }
}
