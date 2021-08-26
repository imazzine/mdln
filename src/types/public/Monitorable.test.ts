import Logger from "./Logger";
import Monitorable from "./Monitorable";

const re = /^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/;
let dt: number;
let m1: Monitorable;
let m2: Monitorable;

describe("@imazzine/core Monitorable class", () => {
  test("Monitorable is a valid constructor", () => {
    expect(() => {
      dt = Date.now();
      m1 = new Monitorable();
      m2 = new Monitorable();
    }).not.toThrow();
  });
  test("getUuid() returns a unique UUID string", () => {
    expect(typeof m1.uid).toEqual("string");
    expect(m1.uid).toEqual(m1.uid);
    expect(re.test(m1.uid)).toBeTruthy();
    expect(typeof m2.uid).toEqual("string");
    expect(m2.uid).toEqual(m2.uid);
    expect(re.test(m2.uid)).toBeTruthy();
    expect(m1.uid).not.toEqual(m2.uid);
  });
  test("getInstantiationStack() returns expected unique string", () => {
    expect(typeof m1.stack).toEqual("string");
    expect(typeof m2.stack).toEqual("string");
    expect(m1.stack.indexOf("Instantiation")).toEqual(0);
    expect(m2.stack.indexOf("Instantiation")).toEqual(0);
    expect(m1.stack.indexOf("Monitorable.test")).toBeGreaterThan(0);
    expect(m2.stack.indexOf("Monitorable.test")).toBeGreaterThan(0);
    expect(m1.stack).not.toEqual(m2.stack);
  });
  test("getInstantiationTimestamp() returns expected number", () => {
    expect(typeof m1.created).toEqual("number");
    expect(typeof m2.created).toEqual("number");
    expect(m2.created - m1.created).toBeLessThan(500);
    expect(m1.created - dt).toBeLessThan(500);
  });
  test("getLogger() returns associated logger", () => {
    expect(m1.logger instanceof Logger).toBeTruthy();
    expect(m2.logger instanceof Logger).toBeTruthy();
    expect(m1.logger.uid).toEqual(m1.uid);
    expect(m2.logger.uid).toEqual(m2.uid);
  });
});
