import { jest } from "@jest/globals";
import Errors from "../../enums/Errors";
import getInternalState from "../../helpers/getInternalState";
import Monitorable from "./Monitorable";
import Disposable from "./Disposable";

class MyChild extends Disposable {
  $dispose() {
    super.$dispose();
  }
}

class MyParent extends MyChild {
  $dispose() {
    return;
  }
}

const internal = getInternalState();

let d: Disposable;

describe("@imazzine/core Disposable class", () => {
  test("Disposable is a valid constructor", () => {
    expect(() => {
      d = new Disposable();
    }).not.toThrow();
    expect(internal.undisposed.size).toEqual(1);
  });
  test("Disposable instance inheritance is valid", () => {
    expect(d instanceof Disposable).toBeTruthy();
    expect(d instanceof Monitorable).toBeTruthy();
  });
  test("Default instance state is valid", () => {
    expect(d.disposed).toBeFalsy();
    expect(d.disposing).toBeFalsy();
    expect(internal.undisposed.get(d.uid)).toEqual(d);
  });
  test("Disposing flow removes instance from undisposed map", () => {
    d.dispose();
    expect(internal.undisposed.size).toEqual(0);
  });
  test("Disposable chain consistency is controlled", () => {
    const ch = new MyChild();
    const pr = new MyParent();

    expect(() => {
      ch.dispose();
    }).not.toThrow();

    expect(() => {
      pr.dispose();
    }).toThrow(Errors.BROKEN_CHAIN);
  });
  test("Manually called Disposable.$dispose is throw", () => {
    d = new Disposable();

    Object.defineProperty(d, "disposing", {
      get: jest.fn(() => false),
    });

    expect(() => {
      d.dispose();
    }).toThrow(Errors.MANUAL_CALL);
  });
  test("Disposable.dispose could be called any number of times", () => {
    d = new Disposable();

    expect(() => {
      d.dispose();
    }).not.toThrow();

    expect(() => {
      d.dispose();
    }).not.toThrow();

    expect(() => {
      d.dispose();
    }).not.toThrow();
  });
});
