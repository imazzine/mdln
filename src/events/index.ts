/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @fileoverview Declaration of the events namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { events as ns0 } from "./Event";
import { events as ns1 } from "./Phase";
import { events as ns2 } from "./Listener";
import { events as ns3 } from "./Listenable";
/**
 * Namespace that provides events related types.
 */
export namespace events {
  export import Listenable = ns3.Listenable;
  export import Event = ns0.Event;
  export import Phase = ns1.Phase;
}

export namespace eventsNS {
  export import Event = ns0.Event;
  export import Phase = ns1.Phase;
  export import Listener = ns2.Listener;
  export import Listenable = ns3.Listenable;
  export import nodes = ns3.nodes;
}
