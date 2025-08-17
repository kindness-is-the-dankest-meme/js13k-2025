import { walk } from "./walk.ts";

export const wtch = async (dirname: string) => {
  const fs = new Set<string>(
    await Array.fromAsync(walk(dirname, Deno.mainModule))
  );

  (async () => {
    /**
     * @see https://docs.deno.com/examples/watching_files/
     */
    const dir = Deno.watchFs(dirname, { recursive: true });

    for await (const { kind, paths } of dir) {
      switch (kind) {
        case "create":
        case "rename": {
          paths.forEach((p) => fs.add(p));
          break;
        }

        case "remove": {
          paths.forEach((p) => fs.delete(p));
          break;
        }
      }
    }
  })();

  return fs;
};
