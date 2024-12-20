import {DeleteRequest} from "~/models/requests";
import SQLiteDataHandler from "~/utils/db";
import {makeResponse} from "~/utils/response";
import {Link} from "~/models/link";

export async function deleteLink(body: DeleteRequest) {
  "use server";
  let db = new SQLiteDataHandler();

  // Traiter les informations
  let search: Link = db.get(body.short_code, true);
  if (!search) return makeResponse(404, { message: "Link not found" });
  if (search.delete_token && !(await Bun.password.verify(body.token, search.delete_token))) return makeResponse(401, { message: "Invalid token" });

  let data = db.delete(body.short_code);
  if (!data) return makeResponse(500, { message: "An error has occurred on the server. Please try again." });

  return makeResponse(200, { message: "Link has been successfully deleted.", data });
}