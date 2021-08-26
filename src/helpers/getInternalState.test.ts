import getInternalState from "./getInternalState";
import InternalState from "../types/internal/InternalState";
const internal1 = getInternalState();
const internal2 = getInternalState();

describe("@imazzine/core getInternalState helper", () => {
  test("helper returns a valid object", () => {
    expect(internal1).toBeDefined();
    expect(internal2).toBeDefined();
    expect(internal1 instanceof InternalState).toBeTruthy();
    expect(internal2 instanceof InternalState).toBeTruthy();
  });
  test("helper returns a singletone object", () => {
    expect(internal1 === internal2).toBeTruthy();
    expect(internal1).toEqual(internal2);
  });
});
