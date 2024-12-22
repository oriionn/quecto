import {HasPasswordRequest} from "~/models/requests";
import SQLiteDataHandler from "~/utils/db";
import {makeResponse} from "~/utils/response";

export async function hasPassword(body: HasPasswordRequest) {
  "use server";
  let db = new SQLiteDataHandler();
  let search = db.get(body.short_code, true);
  if (!search) return makeResponse(404, {message: "Short code not found"});
  return makeResponse(200, {message: `The link ${(!!search.password) ? "have":"don't have"} a password`, data: !!search.password})
}