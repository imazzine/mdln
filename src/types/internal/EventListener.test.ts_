import Event from "../public/Event";
import EventListener from "./EventListener";

let node: EventListener;
function cb(evt: Event) {
  return evt;
}

describe("@imazzine/core EventListener class", () => {
  test("EventListener is a valid constructor", () => {
    expect(() => {
      node = new EventListener(cb, false, false, false, false);
    }).not.toThrow();
  });
  test("EventListener scope 1 saved correctlly", () => {
    node = new EventListener(cb, false, false, false, false);
    expect(node.callback).toEqual(cb);
    expect(node.capture).toBeFalsy();
    expect(node.passive).toBeFalsy();
    expect(node.removed).toBeFalsy();
    expect(node.once).toBeFalsy();
  });
  test("EventListener scope 2 saved correctlly", () => {
    node = new EventListener(cb, true, true, true, true);
    expect(node.callback).toEqual(cb);
    expect(node.capture).toBeTruthy();
    expect(node.passive).toBeTruthy();
    expect(node.removed).toBeTruthy();
    expect(node.once).toBeTruthy();
  });
  test("EventListener scope 3 saved correctlly", () => {
    node = new EventListener(cb, true, false, true, false);
    expect(node.callback).toEqual(cb);
    expect(node.capture).toBeTruthy();
    expect(node.passive).toBeFalsy();
    expect(node.removed).toBeTruthy();
    expect(node.once).toBeFalsy();
  });
  test("EventListener scope 4 saved correctlly", () => {
    node = new EventListener(cb);
    expect(node.callback).toEqual(cb);
    expect(node.capture).toBeFalsy();
    expect(node.passive).toBeFalsy();
    expect(node.removed).toBeFalsy();
    expect(node.once).toBeFalsy();
  });
});
