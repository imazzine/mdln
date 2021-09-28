/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @fileoverview Declaration of the events namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { events as ns0 } from "./Event";
import { events as ns1 } from "./EventPhase";
import { events as ns2 } from "./EventListener";
import { events as ns3 } from "./Listenable";
/**
 * Namespace that provides events related types.
 */
export namespace events {
  export import Listenable = ns3.Listenable;
  export import Event = ns0.Event;
  export import EventPhase = ns1.EventPhase;
}

export namespace eventsNS {
  export import Event = ns0.Event;
  export import EventPhase = ns1.EventPhase;
  export import EventListener = ns2.EventListener;
  export import Listenable = ns3.Listenable;
  export import nodes = ns3.nodes;
  export import getAncestors = ns3.getAncestors;
}
