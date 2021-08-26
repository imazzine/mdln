import EventPhase from "../../enums/EventPhase";
import EventBinder from "./EventBinder";
import Listenable from "../public/Listenable";

const l1 = new Listenable();
const l2 = new Listenable();
let binder: EventBinder;

describe("@imazzine/core EventBinder class", () => {
  test("EventBinder is a valid constructor", () => {
    expect(() => {
      binder = new EventBinder(EventPhase.NONE, l1, l2);
    }).not.toThrow();
  });
  test("binder object contains expected properties", () => {
    expect(Object.keys(binder)).toContain("phase");
    expect(Object.keys(binder)).toContain("passive");
    expect(Object.keys(binder)).toContain("stopped");
    expect(Object.keys(binder)).toContain("prevented");
    expect(Object.keys(binder)).toContain("target");
    expect(Object.keys(binder)).toContain("current");
  });
  test("binder object default values are expected", () => {
    expect(binder.phase).toEqual(EventPhase.NONE);
    expect(binder.passive).toBeFalsy();
    expect(binder.stopped).toBeFalsy();
    expect(binder.prevented).toBeFalsy();
    expect(binder.target).toEqual(l1);
    expect(binder.current).toEqual(l2);
  });
});
