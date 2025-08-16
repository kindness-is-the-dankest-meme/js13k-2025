import { fres } from "./server/fres.ts";

declare global {
  type F<T> = T extends new (...args: infer A) => infer R
    ? (...args: A) => R
    : never;
}

Deno.serve(() =>
  fres("501 - Not Implemented", {
    status: 501,
    statusText: "Not Implemented",
  })
);
