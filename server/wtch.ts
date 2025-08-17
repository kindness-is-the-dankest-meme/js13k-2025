import { dirname } from "jsr:@std/path/dirname";
import { relative } from "jsr:@std/path/relative";
import { walk } from "./walk.ts";
import { furl } from "./furl.ts";

export const wtch = async (dir: string) => {
  /**
   * is this roughly the same as `URL.fileURLToPath`? ... maybe this just won't
   * work on Windows environments?
   *
   * @see https://docs.deno.com/api/node/url/~/fileURLToPath
   */
  const mdir = dirname(furl(Deno.mainModule).pathname);

  const fs = new Set<string>(
    /**
     * n.b. `Deno.mainModule` here is
     * `"file:///Users/matt/Sites/kitdm/js13k-2025/main.ts"`
     */
    await Array.fromAsync(walk(dir, Deno.mainModule))
  );

  (async () => {
    /**
     * @see https://docs.deno.com/examples/watching_files/
     */
    const watcher = Deno.watchFs(dir, { recursive: true });

    for await (const { kind, paths } of watcher) {
      switch (kind) {
        case "create":
        case "rename": {
          paths.forEach((p) => fs.add(relative(mdir, p)));
          break;
        }

        case "remove": {
          paths.forEach((p) => fs.delete(relative(mdir, p)));
          break;
        }
      }
    }
  })();

  return fs;
};
