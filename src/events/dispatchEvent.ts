/**
 * @fileoverview Declaration of the dispatchEvent function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { logNS as log } from "../logs";
import { events as ns0 } from "./EventPhase"
import { events as ns1 } from "./Event"
import { events as ns2 } from "./EventBinder"
import { events as ns3 } from "./Listenable";
import { events as ns4 } from "./fireListeners";
export namespace events {
  import EventPhase = ns0.EventPhase;
  import EventBinder = ns2.EventBinder;
  import Listenable = ns3.Listenable;
  import Event = ns1.Event;
  import getAncestors = ns3.getAncestors;
  import fireListeners = ns4.fireListeners;

  /**
   * Dispatches an event with the specified type and scope, and calls all
   * listeners listening for events of this type, putting generated event
   * object to the listener's callback.
   *
   * If any of the listeners returns false OR calls `event.prevent()` then this
   * function will return false. If one of the capture listeners calls
   * event.stop(), then the bubble listeners won't fire.
   */
  function dispatchEvent(
    node: Listenable,
    type: string,
    scope?: unknown,
  ): boolean {
    // construct an event binder
    const binder = new EventBinder(EventPhase.NONE, node, node);
    node.logger.debug(
      log.message.getCalled(`binder`, "EventBinder", "constructor", [
        EventPhase.NONE,
        `{${node.uid}}`,
        `{${node.uid}}`,
      ]),
    );

    // construct an event
    const event = new Event(type, binder, scope);
    node.logger.debug(
      log.message.getCalled(`event`, "Event", "constructor", [
        type,
        "{binder}",
        scope,
      ]),
    );

    // get object's ancestors if any
    const ancestors: Array<Listenable> = getAncestors(node) as Array<Listenable>;

    // run capturing phase cycle
    for (let i = ancestors.length - 1; i >= 0; i--) {
      binder.phase = EventPhase.CAPTURING_PHASE;
      node.logger.debug(
        log.message.getCalled(`binder`, "EventBinder", "phase", [binder.phase]),
      );
      binder.handler = ancestors[i];
      node.logger.debug(
        log.message.getCalled(`binder`, "EventBinder", "handler", [
          `{${binder.handler.uid}}`,
        ]),
      );
      fireListeners(binder, event, true);
    }

    // run capturing at target if event wasn't stoped
    if (!binder.stopped) {
      binder.phase = EventPhase.AT_TARGET;
      node.logger.debug(
        log.message.getCalled(`binder`, "EventBinder", "phase", [binder.phase]),
      );
      binder.handler = node;
      node.logger.debug(
        log.message.getCalled(`binder`, "EventBinder", "current", [
          `{${binder.handler.uid}}`,
        ]),
      );
      fireListeners(binder, event, true);
    }

    // run bubbling at target if event wasn't stoped
    if (!binder.stopped) {
      fireListeners(binder, event, false);
    }

    // run bubbling phase cycle if event wasn't stoped
    if (!binder.stopped) {
      for (let i = 0; !binder.stopped && i < ancestors.length; i++) {
        binder.phase = EventPhase.BUBBLING_PHASE;
        node.logger.debug(
          log.message.getCalled(`binder`, "EventBinder", "phase", [
            binder.phase,
          ]),
        );
        binder.handler = ancestors[i];
        node.logger.debug(
          log.message.getCalled(`binder`, "EventBinder", "current", [
            `{${binder.handler.uid}}`,
          ]),
        );
        fireListeners(binder, event, false);
      }
    }

    // unset event phase
    binder.phase = EventPhase.NONE;
    node.logger.debug(
      log.message.getCalled(`binder`, "EventBinder", "phase", [binder.phase]),
    );
    return !binder.stopped;
  }
}
