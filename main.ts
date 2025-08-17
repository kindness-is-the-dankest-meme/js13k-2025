import { stat } from "./server/stat.ts";
import { wtch } from "./server/wtch.ts";

declare global {
  type F<T> = T extends new (...args: infer A) => infer R
    ? (...args: A) => R
    : never;
}

const fs = await wtch("public");

Deno.serve(() => {
  console.log(fs);
  return stat(501);
});
