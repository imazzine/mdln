import getUid from "./getUid";
describe("@imazzine/core getUid", () => {
  test("returned value is a string", () => {
    expect(typeof getUid()).toEqual("string");
  });
  test("returned value pass UUID regex test", () => {
    const re =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/;
    expect(re.test(getUid())).toBeTruthy();
  });
  test("returned values are unique", () => {
    expect(getUid()).not.toEqual(getUid());
  });
});
