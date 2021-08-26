/**
 * Returns call stack up to the point from where this function was called.
 * @param title Optional title for the generated stack.
 */
function getStack(title = "Stack"): string {
  const e = new Error();
  let stack: string = e.stack || "No stack. Sorry.";
  stack = stack.replace("Error", title);
  const stackArray = stack.split("\n");
  stackArray.splice(1, 1);
  stack = stackArray.join("\n");
  return stack;
}
export default getStack;
