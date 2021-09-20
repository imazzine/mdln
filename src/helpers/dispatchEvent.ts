import EventPhase from "../enums/EventPhase";
import Logger from "../types/public/Logger";
import Event from "../types/public/Event";
import Listenable from "../types/public/Listenable";
import EventBinder from "../types/internal/EventBinder";
import getAncestors from "./getAncestors";
import fireListeners from "./fireListeners";

/**
 * //
 */
function dispatchEvent(
  node: Listenable,
  type: string,
  scope?: unknown,
): boolean {
  node.logger.trace(Logger.checkpoint("mdln/helpers/dispatchEvent", "start"));

  const binder = new EventBinder(EventPhase.NONE, node, node);
  node.logger.debug(
    Logger.variable_changed(`binder`, "EventBinder", "constructor", [
      EventPhase.NONE,
      `{${node.uid}}`,
      `{${node.uid}}`,
    ]),
  );

  const event = new Event(type, binder, scope);
  node.logger.debug(
    Logger.variable_changed(`event`, "Event", "constructor", [
      type,
      "{binder}",
      scope,
    ]),
  );

  const ancestors: Array<Listenable> = getAncestors(node);

  node.logger.trace(
    Logger.checkpoint("mdln/helpers/dispatchEvent", "capturing ancestors"),
  );
  for (let i = ancestors.length - 1; i >= 0; i--) {
    binder.phase = EventPhase.CAPTURING_PHASE;
    node.logger.debug(
      Logger.variable_changed(`binder`, "EventBinder", "phase", [binder.phase]),
    );

    binder.current = ancestors[i];
    node.logger.debug(
      Logger.variable_changed(`binder`, "EventBinder", "current", [
        `{${binder.current.uid}}`,
      ]),
    );

    fireListeners(binder, event, true);
  }
  if (!binder.stopped) {
    node.logger.trace(
      Logger.checkpoint("mdln/helpers/dispatchEvent", "capturing at target"),
    );

    binder.phase = EventPhase.AT_TARGET;
    node.logger.debug(
      Logger.variable_changed(`binder`, "EventBinder", "phase", [binder.phase]),
    );

    binder.current = node;
    node.logger.debug(
      Logger.variable_changed(`binder`, "EventBinder", "current", [
        `{${binder.current.uid}}`,
      ]),
    );

    fireListeners(binder, event, true);
  }
  if (!binder.stopped) {
    node.logger.trace(
      Logger.checkpoint("mdln/helpers/dispatchEvent", "bubbling at target"),
    );

    fireListeners(binder, event, false);
  }
  if (!binder.stopped) {
    node.logger.trace(
      Logger.checkpoint("mdln/helpers/dispatchEvent", "bubbling ancestors"),
    );

    for (let i = 0; !binder.stopped && i < ancestors.length; i++) {
      binder.phase = EventPhase.BUBBLING_PHASE;
      node.logger.debug(
        Logger.variable_changed(`binder`, "EventBinder", "phase", [
          binder.phase,
        ]),
      );

      binder.current = ancestors[i];
      node.logger.debug(
        Logger.variable_changed(`binder`, "EventBinder", "current", [
          `{${binder.current.uid}}`,
        ]),
      );

      fireListeners(binder, event, false);
    }
  }
  binder.phase = EventPhase.NONE;
  node.logger.debug(
    Logger.variable_changed(`binder`, "EventBinder", "phase", [binder.phase]),
  );

  node.logger.trace(Logger.checkpoint("mdln/helpers/dispatchEvent", "end"));
  return !binder.stopped;
}
export default dispatchEvent;
