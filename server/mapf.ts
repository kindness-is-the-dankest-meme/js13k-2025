import { parse } from "jsr:@std/path/parse";
import { nrml } from "./nrml.ts";
import { Exts } from "./exts.ts";
import { furl } from "./furl.ts";

export const mapf = (url: Request["url"], fs: Set<string>) => {
  const parsed = parse(furl(url).pathname),
    { dir } = parsed;
  let { ext, name } = parsed;

  if (ext === Exts.Js && fs.has(nrml(dir, name, Exts.Ts))) {
    ext = Exts.Ts;
  }

  if (name === "" && ext === "") {
    ext = Exts.Html;
    name = "index";
  }

  return {
    dir,
    name,
    ext,
  };
};
