import getStack from "./getStack";
const GlobalError = Error;
class MockedError extends GlobalError {
  public message: string;
  constructor(message: string) {
    super(message);
    this.stack = undefined;
    this.message = message;
  }
}
describe("@imazzine/core getStack", () => {
  test("returned value is a string", () => {
    expect(typeof getStack()).toEqual("string");
  });
  test("returned values are unique", () => {
    expect(getStack()).not.toEqual(getStack());
  });
  test("returned values are not unique if stack is undefined", () => {
    const spy = jest.spyOn(global, "Error");
    spy.mockReturnValue(new MockedError("No stack. Sorry."));
    expect(getStack()).toEqual("No stack. Sorry.");
    expect(getStack()).toEqual(getStack());
    spy.mockRestore();
  });
  test("a call without the parameter is valid", () => {
    expect(getStack().indexOf("Stack")).toEqual(0);
  });
  test("a call with the parameter is valid", () => {
    expect(getStack("Test").indexOf("Test")).toEqual(0);
  });
});
