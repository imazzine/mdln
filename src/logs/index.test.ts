/**
 * @fileoverview Package's export test suite definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as regular_import from "./index";
import { helpers } from "./helpers";
import { logger } from "./logger";
import { message } from "./message";
import { level } from "./level";
import { logs } from "./Monitorable";
describe("Logs namespace export test suite", () => {
  test("export object is defined", () => {
    expect(regular_import).toBeDefined();
  });
  test("logs namespace is exported", () => {
    expect(regular_import.logs).toBeDefined();
  });
  test("logs.Type enum is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("Type");
    expect(regular_import.logs.Type).toEqual(message.Type);
  });
  test("logs.Level enum is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("Level");
    expect(regular_import.logs.Level).toEqual(level.Level);
  });
  test("logs.Log class is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("Log");
    expect(regular_import.logs.Log).toEqual(logger.Log);
  });
  test("logs.Logger class is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("Logger");
    expect(regular_import.logs.Logger).toEqual(logger.Logger);
  });
  test("logs.Buffer class is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("Buffer");
    expect(regular_import.logs.Buffer).toEqual(logger.Buffer);
  });
  test("logs.Monitorable class is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("Monitorable");
    expect(regular_import.logs.Monitorable).toEqual(logs.Monitorable);
  });
  test("logs.getCalled function is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("getCalled");
    expect(regular_import.logs.getCalled).toEqual(message.getCalled);
  });
  test("logs.getChanged function is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("getChanged");
    expect(regular_import.logs.getChanged).toEqual(message.getChanged);
  });
  test("logs.getCheckpoint function is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("getCheckpoint");
    expect(regular_import.logs.getCheckpoint).toEqual(message.getCheckpoint);
  });
  test("logs.getError function is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("getError");
    expect(regular_import.logs.getError).toEqual(message.getError);
  });
  test("logs.getStack function is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("getStack");
    expect(regular_import.logs.getStack).toEqual(helpers.getStack);
  });
  test("logs.getUid function is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("getUid");
    expect(regular_import.logs.getUid).toEqual(helpers.getUid);
  });
  test("logs.setBuffer function is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("setBuffer");
    expect(regular_import.logs.setBuffer).toEqual(logger.setBuffer);
  });
  test("logs.setLevel function is exported", () => {
    expect(Object.keys(regular_import.logs)).toContain("setLevel");
    expect(regular_import.logs.setLevel).toEqual(level.set);
  });
});
