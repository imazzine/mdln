/**
 * @fileoverview Declaration of the events namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { events as ns0 } from "./EventPhase";
import { events as ns1 } from "./Event";
/**
 * Namespace that provides events related types.
 */
export namespace events {
  export import EventPhase = ns0.EventPhase;
  export import Event = ns1.Event;
}
