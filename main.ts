import { stat } from "./server/stat.ts";

declare global {
  type F<T> = T extends new (...args: infer A) => infer R
    ? (...args: A) => R
    : never;
}

Deno.serve(() => stat(501));
