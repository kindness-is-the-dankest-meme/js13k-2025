import { fstt } from "./server/fstt.ts";

declare global {
  type F<T> = T extends new (...args: infer A) => infer R
    ? (...args: A) => R
    : never;
}

Deno.serve(() => fstt(501));
