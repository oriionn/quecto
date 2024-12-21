import SQLiteDataHandler from "~/utils/db";
import {makeResponse} from "~/utils/response";
import {UnshortenRequest} from "~/models/requests";

export async function unshorten(body: UnshortenRequest) {
  "use server";
  const db = new SQLiteDataHandler();
  let search = db.get(body.short_code, true);
  if (!search) return makeResponse(404, { message: "Short code not found" });
  if (body.password) {
    let password = await Bun.password.verify(body.password, search.password);
    if (!password) return makeResponse(401, { message: "Invalid password" });
  }

  let data = db.get(body.short_code, false);
  return makeResponse(200, { message: "Short code found", data });
}