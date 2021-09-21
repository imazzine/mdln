import LogLevel from "../enums/LogLevel";
import getInternalState from "./getInternalState";
import Logger from "../types/public/Logger";
import setLogger from "./setLogger";

class ChildLogger extends Logger {
  constructor(uid: string) {
    super(uid, LogLevel.NONE);
  }
}

describe("@imazzine/core setLogger", () => {
  test("setLogger works as expected", () => {
    expect(getInternalState().Logger).toBeUndefined();
    expect(() => {
      setLogger(ChildLogger);
    }).not.toThrow();
    expect(getInternalState().Logger).not.toEqual(Logger);
    expect(getInternalState().Logger).toEqual(ChildLogger);
  });
});
