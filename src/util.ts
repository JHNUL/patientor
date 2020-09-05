export const assertNever = (x: never): never => {
  throw Error('unhandled type' + x);
};
