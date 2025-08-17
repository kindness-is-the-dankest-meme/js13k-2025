import initSwc, {
  type Options,
  transform,
} from "https://esm.sh/@swc/wasm-web@1.13.3";
import { prod } from "./prod.ts";

const opts: Options = {
  envName: prod ? "production" : "development",
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    // @ts-expect-error these types are just not up to date
    target: "es2024",
    loose: false,
    minify: {
      compress: prod,
      mangle: prod,
      module: true,
    },
  },
  module: {
    type: "es6",
  },
  minify: false,
  isModule: true,
} as const;

await initSwc();

/**
 * replace the trailing `ts` with `js` for any "double-quoted" string matches
 * that start with `.` and end with `ts`
 */
const rsfx = (code: string) => code.replace(/"(\..*)\.ts"/g, '"$1.js"');

export const tsfm = (url: URL) =>
  Deno.readTextFile(url)
    .then((code) => transform(code, opts))
    .then(({ code }) => rsfx(code));
