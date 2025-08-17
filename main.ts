import { Exts } from "./server/exts.ts";
import { fres } from "./server/fres.ts";
import { furl } from "./server/furl.ts";
import { mapf } from "./server/mapf.ts";
import { nrml } from "./server/nrml.ts";
import { open } from "./server/open.ts";
import { mime } from "./server/mime.ts";
import { prod } from "./server/prod.ts";
import { stat } from "./server/stat.ts";
import { tsfm } from "./server/tsfm.ts";
import { wtch } from "./server/wtch.ts";

declare global {
  type F<T> = T extends new (...args: infer A) => infer R
    ? (...args: A) => R
    : never;
}

const fs = await wtch("public");
const file = async ({ url }: Request): Promise<Response> => {
  const { dir, name, ext } = mapf(url, fs),
    path = nrml(dir, name, ext);

  if (!dir.startsWith("/")) return stat(403);
  if (!fs.has(path)) return stat(404);

  try {
    switch (ext) {
      case Exts.Css:
      case Exts.Html: {
        return fres(await open(furl(path, Deno.mainModule)), {
          headers: { "Content-Type": mime(ext) },
        });
      }

      case Exts.Ts: {
        return fres(await tsfm(furl(path, Deno.mainModule)), {
          headers: { "Content-Type": mime(Exts.Js) },
        });
      }
    }
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error(error);

    return prod ? stat(500) : stat(404);
  }

  return stat(501);
};

const hupg = ({ headers }: Request) =>
  headers.get("upgrade")?.toLowerCase() === "websocket";

const sock = (req: Request): Response => {
  const { socket: _, response: res } = Deno.upgradeWebSocket(req);
  // TODO: do stuff with the socket
  return res;
};

Deno.serve((req) => (hupg(req) ? sock : file)(req));
