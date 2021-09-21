import LogLevel from "../enums/LogLevel";
import getInternalState from "./getInternalState";
import setLevel from "./setLevel";

const internal = getInternalState();

describe("@imazzine/core setLevel", () => {
  test("setLevel(NONE) works", () => {
    setLevel(LogLevel.NONE);
    expect(internal.level).toEqual(LogLevel.NONE);
  });
  test("setLevel(TRACE) works", () => {
    setLevel(LogLevel.TRACE);
    expect(internal.level).toEqual(LogLevel.TRACE);
  });
  test("setLevel(DEBUG) works", () => {
    setLevel(LogLevel.DEBUG);
    expect(internal.level).toEqual(LogLevel.DEBUG);
  });
  test("setLevel(INFO) works", () => {
    setLevel(LogLevel.INFO);
    expect(internal.level).toEqual(LogLevel.INFO);
  });
  test("setLevel(WARN) works", () => {
    setLevel(LogLevel.WARN);
    expect(internal.level).toEqual(LogLevel.WARN);
  });
  test("setLevel(ERROR) works", () => {
    setLevel(LogLevel.ERROR);
    expect(internal.level).toEqual(LogLevel.ERROR);
  });
  test("setLevel(FATAL) works", () => {
    setLevel(LogLevel.FATAL);
    expect(internal.level).toEqual(LogLevel.FATAL);
  });
});
