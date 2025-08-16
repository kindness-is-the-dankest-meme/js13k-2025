import { STATUS_TEXT, type StatusCode } from "jsr:@std/http/status";
import { fres } from "./fres.ts";

export const fstt = (code: StatusCode) =>
  fres(`${code} - ${STATUS_TEXT[code]}`, {
    status: code,
    statusText: STATUS_TEXT[code],
  });
