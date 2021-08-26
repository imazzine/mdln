import EventPhase from "../../enums/EventPhase";
import EventBinder from "../internal/EventBinder";
import Listenable from "./Listenable";
import Event from "./Event";

const l1 = new Listenable();
const l2 = new Listenable();
const binder = new EventBinder(EventPhase.NONE, l1, l2);
let evt: Event;

describe("@imazzine/core Event class", () => {
  test("Event is a valid constructor", () => {
    expect(() => {
      evt = new Event("test", binder);
    }).not.toThrow();
  });
  test("Event properties are valid", () => {
    expect(evt.type).toEqual("test");
    expect(typeof evt.stack).toEqual("string");
    expect(typeof evt.timestamp).toEqual("number");
    expect(evt.target).toEqual(l1);
    expect(evt.current).toEqual(l2);
    expect(evt.phase).toEqual(EventPhase.NONE);
    expect(evt.prevented).toBeFalsy();
    expect(evt.stopped).toBeFalsy();
    expect(evt.scope).toEqual({});
  });
  test("preventDefault method change event state", () => {
    expect(() => {
      evt.preventDefault();
    }).not.toThrow();
    expect(evt.type).toEqual("test");
    expect(typeof evt.stack).toEqual("string");
    expect(typeof evt.timestamp).toEqual("number");
    expect(evt.target).toEqual(l1);
    expect(evt.current).toEqual(l2);
    expect(evt.phase).toEqual(EventPhase.NONE);
    expect(evt.prevented).toBeTruthy();
    expect(evt.stopped).toBeFalsy();
  });
  test("stopPropagation method change event state", () => {
    expect(() => {
      evt.stopPropagation();
    }).not.toThrow();
    expect(evt.type).toEqual("test");
    expect(typeof evt.stack).toEqual("string");
    expect(typeof evt.timestamp).toEqual("number");
    expect(evt.target).toEqual(l1);
    expect(evt.current).toEqual(l2);
    expect(evt.phase).toEqual(EventPhase.NONE);
    expect(evt.prevented).toBeTruthy();
    expect(evt.stopped).toBeTruthy();
  });
  test("passive behavior is valid", () => {
    const binder = new EventBinder(EventPhase.NONE, l1, l2);
    binder.passive = true;
    evt = new Event("test", binder);
    evt.preventDefault();
    evt.stopPropagation();
    expect(evt.prevented).toBeFalsy();
    expect(evt.stopped).toBeFalsy();
  });
  test("scope is valid", () => {
    const binder = new EventBinder(EventPhase.NONE, l1, l2);
    binder.passive = true;
    evt = new Event("test", binder, { a: true });
    expect(evt.scope).toEqual({ a: true });
  });
});
