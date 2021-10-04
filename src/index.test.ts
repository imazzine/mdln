/**
 * @fileoverview Package's export test suite definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as regular_import from "./index";
import default_import from "./index";
import { errors } from "./errors";
import { events } from "./events";
import { logs } from "./logs";
import { symbols } from "./symbols";
import { tree } from "./tree";
describe("Package's export test suite", () => {
  test("export object is defined", () => {
    expect(regular_import).toBeDefined();
  });
  test("default export object is defined", () => {
    expect(default_import).toBeDefined();
  });
  test("errors namespace is exported", () => {
    expect(Object.keys(regular_import)).toContain("errors");
    expect(Object.keys(default_import)).toContain("errors");
    expect(regular_import.errors).toEqual(default_import.errors);
    expect(regular_import.errors).toEqual(errors);
  });
  test("events namespace is exported", () => {
    expect(Object.keys(regular_import)).toContain("events");
    expect(Object.keys(default_import)).toContain("events");
    expect(regular_import.events).toEqual(default_import.events);
    expect(regular_import.events).toEqual(events);
  });
  test("logs namespace is exported", () => {
    expect(Object.keys(regular_import)).toContain("logs");
    expect(Object.keys(default_import)).toContain("logs");
    expect(regular_import.logs).toEqual(default_import.logs);
    expect(regular_import.logs).toEqual(logs);
  });
  test("symbols namespace is exported", () => {
    expect(Object.keys(regular_import)).toContain("symbols");
    expect(Object.keys(default_import)).toContain("symbols");
    expect(regular_import.symbols).toEqual(default_import.symbols);
    expect(regular_import.symbols).toEqual(symbols);
  });
  test("tree namespace is exported", () => {
    expect(Object.keys(regular_import)).toContain("tree");
    expect(Object.keys(default_import)).toContain("tree");
    expect(regular_import.tree).toEqual(default_import.tree);
    expect(regular_import.tree).toEqual(tree);
  });
  test("Monitorable class is exported", () => {
    expect(Object.keys(regular_import)).toContain("Monitorable");
    expect(Object.keys(default_import)).toContain("Monitorable");
    expect(regular_import.Monitorable).toEqual(default_import.Monitorable);
    expect(regular_import.Monitorable).toEqual(logs.Monitorable);
  });
  test("Listenable class is exported", () => {
    expect(Object.keys(regular_import)).toContain("Listenable");
    expect(Object.keys(default_import)).toContain("Listenable");
    expect(regular_import.Listenable).toEqual(default_import.Listenable);
    expect(regular_import.Listenable).toEqual(events.Listenable);
  });
  test("Node class is exported", () => {
    expect(Object.keys(regular_import)).toContain("Node");
    expect(Object.keys(default_import)).toContain("Node");
    expect(regular_import.Node).toEqual(default_import.Node);
    expect(regular_import.Node).toEqual(tree.Node);
  });
});
