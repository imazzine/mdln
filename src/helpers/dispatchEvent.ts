import EventPhase from "../enums/EventPhase";
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
  const binder = new EventBinder(EventPhase.NONE, node, node);
  const event = new Event(type, binder, scope);
  const ancestors: Array<Listenable> = getAncestors(node);
  for (let i = ancestors.length - 1; i >= 0; i--) {
    binder.phase = EventPhase.CAPTURING_PHASE;
    binder.current = ancestors[i];
    fireListeners(binder, event, true);
  }
  if (!binder.stopped) {
    binder.phase = EventPhase.AT_TARGET;
    binder.current = node;
    fireListeners(binder, event, true);
  }
  if (!binder.stopped) {
    fireListeners(binder, event, false);
  }
  if (!binder.stopped) {
    for (let i = 0; !binder.stopped && i < ancestors.length; i++) {
      binder.phase = EventPhase.BUBBLING_PHASE;
      binder.current = ancestors[i];
      fireListeners(binder, event, false);
    }
  }
  binder.phase = EventPhase.NONE;
  return !binder.stopped;
}
export default dispatchEvent;
