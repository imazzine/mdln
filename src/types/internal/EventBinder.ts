import EventPhase from "../../enums/EventPhase";
import Listenable from "../public/Listenable";

class EventBinder {
  phase: EventPhase;
  passive = false;
  stopped: false | Date = false;
  prevented: false | Date = false;
  target: Listenable;
  current: Listenable;
  constructor(phase: EventPhase, target: Listenable, current: Listenable) {
    this.phase = phase || EventPhase.NONE;
    this.target = target;
    this.current = current;
  }
}
export default EventBinder;
