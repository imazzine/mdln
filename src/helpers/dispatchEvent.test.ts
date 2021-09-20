import dispatchEvent from "./dispatchEvent";
import EventPhase from "../enums/EventPhase";
import Listenable from "../types/public/Listenable";
import Node from "../types/public/Node";
import Event from "../types/public/Event";

const l = new Listenable();
const n = new Node();
const n1 = new Node();
const n2 = new Node();
n1.insert(n2);

const events: Event[] = [];
const phases: EventPhase[] = [];
const cb1 = (evt: Event) => {
  events.push(evt);
  phases.push(evt.phase);
};
const cb2 = (evt: Event) => {
  events.push(evt);
  phases.push(evt.phase);
  evt.stop();
};

describe("@imazzine/core dispatchEvent helper", () => {
  test("dispatchEvent works with the Listenable with one callback", () => {
    const scope = { a: 1 };
    l.listen("etype", cb1, {
      capture: true,
    });
    expect(dispatchEvent(l, "etype", scope)).toBeTruthy();
    expect(events.length).toEqual(1);
    expect(events[0].scope).toStrictEqual(scope);
    expect(events[0].target).toStrictEqual(l);
    expect(events[0].current).toStrictEqual(l);
    expect(events[0].phase).toEqual(EventPhase.NONE);
    expect(phases[0]).toEqual(EventPhase.AT_TARGET);
    l.unlisten("etype", cb1, {
      capture: true,
    });
  });
  test("dispatchEvent works with the Listenable with one callback (stoped event)", () => {
    const scope = { a: 2 };
    l.listen("etype", cb2, {
      capture: true,
    });
    expect(dispatchEvent(l, "etype", scope)).toBeFalsy();
    expect(events.length).toEqual(2);
    expect(events[1].scope).toStrictEqual(scope);
    expect(events[1].target).toStrictEqual(l);
    expect(events[1].current).toStrictEqual(l);
    expect(events[1].phase).toEqual(EventPhase.NONE);
    expect(phases[1]).toEqual(EventPhase.AT_TARGET);
    l.unlisten("etype", cb2, {
      capture: true,
    });
  });
  test("dispatchEvent works with the Listenable with the set of the callbacks", () => {
    const scope = { a: 3 };
    l.listen("etype", cb1, {
      capture: true,
    });
    l.listen("etype", cb1, {
      capture: false,
    });
    expect(dispatchEvent(l, "etype", scope)).toBeTruthy();
    expect(events.length).toEqual(4);
    expect(events[2].scope).toStrictEqual(scope);
    expect(events[2].target).toStrictEqual(l);
    expect(events[2].current).toStrictEqual(l);
    expect(events[2].phase).toEqual(EventPhase.NONE);
    expect(phases[2]).toEqual(EventPhase.AT_TARGET);
    expect(events[3].scope).toStrictEqual(scope);
    expect(events[3].target).toStrictEqual(l);
    expect(events[3].current).toStrictEqual(l);
    expect(events[3].phase).toEqual(EventPhase.NONE);
    expect(phases[3]).toEqual(EventPhase.AT_TARGET);
    l.unlisten("etype", cb1, {
      capture: true,
    });
    l.unlisten("etype", cb1, {
      capture: false,
    });
  });
  test("dispatchEvent works with the Listenable with the set of the callbacks (stoped event)", () => {
    const scope = { a: 4 };
    l.listen("etype", cb1, {
      capture: true,
    });
    l.listen("etype", cb2, {
      capture: true,
    });
    l.listen("etype", cb1, {
      capture: true,
    });
    l.listen("etype", cb1, {
      capture: false,
    });
    l.listen("etype", cb2, {
      capture: false,
    });
    expect(dispatchEvent(l, "etype", scope)).toBeFalsy();
    expect(events.length).toEqual(6);
    expect(events[4].scope).toStrictEqual(scope);
    expect(events[4].target).toStrictEqual(l);
    expect(events[4].current).toStrictEqual(l);
    expect(events[4].phase).toEqual(EventPhase.NONE);
    expect(phases[4]).toEqual(EventPhase.AT_TARGET);
    expect(events[5].scope).toStrictEqual(scope);
    expect(events[5].target).toStrictEqual(l);
    expect(events[5].current).toStrictEqual(l);
    expect(events[5].phase).toEqual(EventPhase.NONE);
    expect(phases[5]).toEqual(EventPhase.AT_TARGET);
    l.unlisten("etype", cb1, {
      capture: true,
    });
    l.unlisten("etype", cb2, {
      capture: true,
    });
    l.unlisten("etype", cb1, {
      capture: true,
    });
    l.unlisten("etype", cb1, {
      capture: false,
    });
    l.unlisten("etype", cb2, {
      capture: false,
    });
  });
  test("dispatchEvent works with the single Node with one callback", () => {
    const scope = { a: 1 };
    n.listen("etype", cb1, {
      capture: true,
    });
    expect(dispatchEvent(n, "etype", scope)).toBeTruthy();
    expect(events.length).toEqual(7);
    expect(events[6].scope).toStrictEqual(scope);
    expect(events[6].target).toStrictEqual(n);
    expect(events[6].current).toStrictEqual(n);
    expect(events[6].phase).toEqual(EventPhase.NONE);
    expect(phases[6]).toEqual(EventPhase.AT_TARGET);
    n.unlisten("etype", cb1, {
      capture: true,
    });
  });
  test("dispatchEvent works with the single Node with one callback (stoped event)", () => {
    const scope = { a: 2 };
    n.listen("etype", cb2, {
      capture: true,
    });
    expect(dispatchEvent(n, "etype", scope)).toBeFalsy();
    expect(events.length).toEqual(8);
    expect(events[7].scope).toStrictEqual(scope);
    expect(events[7].target).toStrictEqual(n);
    expect(events[7].current).toStrictEqual(n);
    expect(events[7].phase).toEqual(EventPhase.NONE);
    expect(phases[7]).toEqual(EventPhase.AT_TARGET);
    n.unlisten("etype", cb2, {
      capture: true,
    });
  });
  test("dispatchEvent works with the single Node with the set of the callbacks", () => {
    const scope = { a: 3 };
    n.listen("etype", cb1, {
      capture: true,
    });
    n.listen("etype", cb1, {
      capture: false,
    });
    expect(dispatchEvent(n, "etype", scope)).toBeTruthy();
    expect(events.length).toEqual(10);
    expect(events[8].scope).toStrictEqual(scope);
    expect(events[8].target).toStrictEqual(n);
    expect(events[8].current).toStrictEqual(n);
    expect(events[8].phase).toEqual(EventPhase.NONE);
    expect(phases[8]).toEqual(EventPhase.AT_TARGET);
    expect(events[9].scope).toStrictEqual(scope);
    expect(events[9].target).toStrictEqual(n);
    expect(events[9].current).toStrictEqual(n);
    expect(events[9].phase).toEqual(EventPhase.NONE);
    expect(phases[9]).toEqual(EventPhase.AT_TARGET);
    n.unlisten("etype", cb1, {
      capture: true,
    });
    n.unlisten("etype", cb1, {
      capture: false,
    });
  });
  test("dispatchEvent works with the single Node with the set of the callbacks (stoped event)", () => {
    const scope = { a: 4 };
    n.listen("etype", cb1, {
      capture: true,
    });
    n.listen("etype", cb2, {
      capture: true,
    });
    n.listen("etype", cb1, {
      capture: true,
    });
    n.listen("etype", cb1, {
      capture: false,
    });
    n.listen("etype", cb2, {
      capture: false,
    });
    expect(dispatchEvent(n, "etype", scope)).toBeFalsy();
    expect(events.length).toEqual(12);
    expect(events[10].scope).toStrictEqual(scope);
    expect(events[10].target).toStrictEqual(n);
    expect(events[10].current).toStrictEqual(n);
    expect(events[10].phase).toEqual(EventPhase.NONE);
    expect(phases[10]).toEqual(EventPhase.AT_TARGET);
    expect(events[11].scope).toStrictEqual(scope);
    expect(events[11].target).toStrictEqual(n);
    expect(events[11].current).toStrictEqual(n);
    expect(events[11].phase).toEqual(EventPhase.NONE);
    expect(phases[11]).toEqual(EventPhase.AT_TARGET);
    n.unlisten("etype", cb1, {
      capture: true,
    });
    n.unlisten("etype", cb2, {
      capture: true,
    });
    n.unlisten("etype", cb1, {
      capture: true,
    });
    n.unlisten("etype", cb1, {
      capture: false,
    });
    n.unlisten("etype", cb2, {
      capture: false,
    });
  });
  test("dispatchEvent works with multiple Nodes with one callback", () => {
    const scope = { a: 1 };
    n1.listen("etype", cb1, {
      capture: true,
    });
    n2.listen("etype", cb1, {
      capture: true,
    });
    expect(dispatchEvent(n1, "etype", scope)).toBeTruthy();
    expect(events.length).toEqual(13);
    expect(events[12].scope).toStrictEqual(scope);
    expect(events[12].target).toStrictEqual(n2);
    expect(events[12].current).toStrictEqual(n2);
    expect(events[12].phase).toEqual(EventPhase.NONE);
    expect(phases[12]).toEqual(EventPhase.AT_TARGET);
    expect(dispatchEvent(n2, "etype", scope)).toBeTruthy();
    expect(events.length).toEqual(15);
    expect(events[13].scope).toStrictEqual(scope);
    expect(events[13].target).toStrictEqual(n2);
    expect(events[13].current).toStrictEqual(n1);
    expect(events[13].phase).toEqual(EventPhase.NONE);
    expect(phases[13]).toEqual(EventPhase.CAPTURING_PHASE);
    expect(events[14].scope).toStrictEqual(scope);
    expect(events[14].target).toStrictEqual(n2);
    expect(events[14].current).toStrictEqual(n2);
    expect(events[14].phase).toEqual(EventPhase.NONE);
    expect(phases[14]).toEqual(EventPhase.AT_TARGET);
    n1.unlisten("etype", cb1, {
      capture: true,
    });
    n2.unlisten("etype", cb1, {
      capture: true,
    });
  });
  test("dispatchEvent works with multiple Nodes with one callback (stopped event)", () => {
    const scope = { a: 1 };
    n1.listen("etype", cb2, {
      capture: true,
    });
    n2.listen("etype", cb1, {
      capture: false,
    });
    expect(dispatchEvent(n2, "etype", scope)).toBeFalsy();
    expect(events.length).toEqual(16);
    expect(events[15].scope).toStrictEqual(scope);
    expect(events[15].target).toStrictEqual(n2);
    expect(events[15].current).toStrictEqual(n1);
    expect(events[15].phase).toEqual(EventPhase.NONE);
    expect(phases[15]).toEqual(EventPhase.CAPTURING_PHASE);
    n1.unlisten("etype", cb2, {
      capture: true,
    });
    n2.unlisten("etype", cb1, {
      capture: false,
    });
  });
  test("dispatchEvent works with multiple Nodes with many callbacks (stopped event)", () => {
    const scope = { a: 1 };
    n1.listen("etype", cb1, {
      capture: true,
    });
    n2.listen("etype", cb1, {
      capture: true,
    });
    n2.listen("etype", cb2, {
      capture: false,
    });
    n1.listen("etype", cb1, {
      capture: false,
    });
    expect(dispatchEvent(n2, "etype", scope)).toBeFalsy();
    expect(events.length).toEqual(19);
    expect(events[16].scope).toStrictEqual(scope);
    expect(events[16].target).toStrictEqual(n2);
    expect(events[16].current).toStrictEqual(n1);
    expect(events[16].phase).toEqual(EventPhase.NONE);
    expect(phases[16]).toEqual(EventPhase.CAPTURING_PHASE);
    expect(events[17].scope).toStrictEqual(scope);
    expect(events[17].target).toStrictEqual(n2);
    expect(events[17].current).toStrictEqual(n2);
    expect(events[17].phase).toEqual(EventPhase.NONE);
    expect(phases[17]).toEqual(EventPhase.AT_TARGET);
    expect(events[18].scope).toStrictEqual(scope);
    expect(events[18].target).toStrictEqual(n2);
    expect(events[18].current).toStrictEqual(n2);
    expect(events[18].phase).toEqual(EventPhase.NONE);
    expect(phases[18]).toEqual(EventPhase.AT_TARGET);
    n1.unlisten("etype", cb1, {
      capture: true,
    });
    n2.unlisten("etype", cb1, {
      capture: true,
    });
    n2.unlisten("etype", cb2, {
      capture: false,
    });
    n1.unlisten("etype", cb1, {
      capture: false,
    });
  });
});
