import * as regular_import from "./index";

import Errors from "./enums/Errors";
import LogLevel from "./enums/LogLevel";
import EventPhase from "./enums/EventPhase";

describe("@imazzine/core exports", () => {
  test("the regular export object is defined", () => {
    expect(regular_import).toBeDefined();
  });
  test("Errors enum is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("Errors");
    expect(regular_import.Errors).toEqual(Errors);
  });
  test("EventPhase enum is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("EventPhase");
    expect(regular_import.EventPhase).toEqual(EventPhase);
  });
  test("LogLevel enum is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("LogLevel");
    expect(regular_import.LogLevel).toEqual(LogLevel);
  });
  test("getUid function is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("getUid");
    expect(typeof regular_import.getUid).toEqual("function");
  });
  test("getStack function is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("getStack");
    expect(typeof regular_import.getStack).toEqual("function");
  });
  test("setLevel function is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("setLevel");
    expect(typeof regular_import.setLevel).toEqual("function");
  });
  test("Logger class is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("Logger");
    expect(typeof regular_import.Logger).toEqual("function");
  });
  test("Event class is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("Event");
    expect(typeof regular_import.Event).toEqual("function");
  });
  test("Monitorable class is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("Monitorable");
    expect(typeof regular_import.Monitorable).toEqual("function");
  });
  test("Disposable class is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("Disposable");
    expect(typeof regular_import.Disposable).toEqual("function");
  });
  test("Listenable class is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("Listenable");
    expect(typeof regular_import.Listenable).toEqual("function");
  });
  test("Node class is exported as expected", () => {
    expect(Object.keys(regular_import)).toContain("Node");
    expect(typeof regular_import.Node).toEqual("function");
  });
});
