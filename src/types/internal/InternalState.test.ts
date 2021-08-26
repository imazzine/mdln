import InternalState from "./InternalState";
import LogLevel from "../../enums/LogLevel";

let internal: InternalState;

describe("@imazzine/core InternalState class", () => {
  test("InternalState is a valid constructor", () => {
    expect(() => {
      internal = new InternalState();
    }).not.toThrow();
  });
  test("internal object contains expected properties", () => {
    expect(Object.keys(internal)).toContain("level");
    expect(Object.keys(internal)).toContain("undisposed");
    expect(Object.keys(internal)).toContain("listenersMaps");
    expect(Object.keys(internal)).toContain("nodesIndices");
  });
  test("internal.level property is equal to the LogLevel.INFO by the default", () => {
    expect(internal.level).toEqual(LogLevel.INFO);
  });
  test("internal.undisposed property is an empty Map", () => {
    expect(internal.undisposed.size).toEqual(0);
  });
  test("internal.listenersMaps property is an empty Map", () => {
    expect(internal.listenersMaps.size).toEqual(0);
  });
  test("internal.nodesIndices property is an empty Map", () => {
    expect(internal.nodesIndices.size).toEqual(0);
  });
});
