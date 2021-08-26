import NodeIndex from "./NodeIndex";
import Node from "../public/Node";

const n1 = new Node();
const n2 = new Node();
let index: NodeIndex;

describe("@imazzine/core NodeIndex class", () => {
  test("NodeIndex properly constructed without parameters", () => {
    expect(() => {
      index = new NodeIndex();
    }).not.toThrow();
    expect(index.parent).toBeUndefined();
    expect(index.children).toHaveLength(0);
  });
  test("NodeIndex properly constructed with parent only", () => {
    expect(() => {
      index = new NodeIndex(n1);
    }).not.toThrow();
    expect(index.parent).toStrictEqual(n1);
    expect(index.children).toHaveLength(0);
  });
  test("NodeIndex properly constructed with parent and empty children array", () => {
    expect(() => {
      index = new NodeIndex(n1, []);
    }).not.toThrow();
    expect(index.parent).toStrictEqual(n1);
    expect(index.children).toHaveLength(0);
  });
  test("NodeIndex properly constructed with parent and one child", () => {
    expect(() => {
      index = new NodeIndex(n1, [n2]);
    }).not.toThrow();
    expect(index.parent).toStrictEqual(n1);
    expect(index.children).toHaveLength(1);
    expect(index.children[0]).toStrictEqual(n2);
  });
});
