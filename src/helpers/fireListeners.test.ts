import getInternalState from "./getInternalState";
import fireListeners from "./fireListeners";
import Listenable from "../types/public/Listenable";
import Event from "../types/public/Event";
import EventBinder from "../types/internal/EventBinder";
import EventPhase from "../enums/EventPhase";
import Errors from "../enums/Errors";

const internal = getInternalState();

const events: Event[] = [];
const cb = (event: Event) => {
  events.push(event);
};

describe("@imazzine/core fireListeners helper", () => {
  test("fireListeners throws as expected", () => {
    const l = new Listenable();
    const eb = new EventBinder(EventPhase.NONE, l, l);
    const evt = new Event("etype", eb);
    l.listen("etype", cb);
    internal.listenersMaps.delete(l);
    expect(() => {
      fireListeners(eb, evt, false);
    }).toThrow(Errors.LISTENERS_MAP_MISSED);
    expect(events.length).toEqual(0);
  });
  test("fireListeners works without listeners", () => {
    const l = new Listenable();
    const eb = new EventBinder(EventPhase.NONE, l, l);
    const evt = new Event("etype", eb);
    expect(() => {
      fireListeners(eb, evt, false);
    }).not.toThrow();
    expect(events.length).toEqual(0);
    l.dispose();
  });
  test("fireListeners works with enabled listener", () => {
    const l = new Listenable();
    const eb = new EventBinder(EventPhase.NONE, l, l);
    const evt = new Event("etype", eb);
    l.listen("etype", cb);
    expect(() => {
      fireListeners(eb, evt, false);
      fireListeners(eb, evt, false);
    }).not.toThrow();
    expect(events.length).toEqual(2);
    expect(events[0]).toStrictEqual(evt);
    expect(events[1]).toStrictEqual(evt);
    l.dispose();
  });
  test("fireListeners works with enabled once listener", () => {
    const l = new Listenable();
    const eb = new EventBinder(EventPhase.NONE, l, l);
    const evt = new Event("etype", eb);
    l.listen("etype", cb, { once: true });
    expect(() => {
      fireListeners(eb, evt, false);
      fireListeners(eb, evt, false);
    }).not.toThrow();
    expect(events.length).toEqual(3);
    expect(events[2]).toStrictEqual(evt);
    l.dispose();
  });
  test("fireListeners works with disabled listener", () => {
    const l = new Listenable();
    const eb = new EventBinder(EventPhase.NONE, l, l);
    const evt = new Event("etype", eb);

    l.listen("etype", cb, { capture: true });
    expect(() => {
      fireListeners(eb, evt, false);
    }).not.toThrow();
    expect(events.length).toEqual(3);
    l.unlisten("etype", cb, { capture: true });

    l.listen("etype", cb);
    evt.stopPropagation();
    expect(() => {
      fireListeners(eb, evt, false);
    }).not.toThrow();
    expect(events.length).toEqual(3);

    l.dispose();
  });
});
