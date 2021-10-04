/**
 * @fileoverview Error class test suite definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { errors as err } from "./index";
describe("Error class test suite", () => {
  let error: err.Error;
  test("instance could be created", () => {
    expect(() => {
      error = new err.Error(
        err.Code.CONSTRUCT_CALL,
        err.Description.CONSTRUCT_CALL,
      );
    }).not.toThrow();
  });
  test("instance inheritance is valid", () => {
    expect(error instanceof Error).toBeTruthy();
  });
  test("instance code is valid", () => {
    expect(error.code).toEqual(err.Code.CONSTRUCT_CALL);
  });
  test("instance message is valid", () => {
    expect(error.message).toEqual(
      `[mln-${err.Code.CONSTRUCT_CALL}] ${err.Description.CONSTRUCT_CALL}`,
    );
  });
  test("instance name is valid", () => {
    expect(error.name).toEqual("Error");
  });
});
