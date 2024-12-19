import {makeResponse} from "~/utils/response";
import SQLiteDataHandler from "~/utils/db";
import {ShortenRequest} from "~/models/requests";
import {randomBytes} from "crypto";

export async function shorten(body: ShortenRequest) {
  const db = new SQLiteDataHandler();

  // Traiter les informations
  let hashedPassword = null;
  if (body.password) hashedPassword = await Bun.password.hash(body.password);
  let linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  if (!linkRegex.test(body.link)) return makeResponse(400, { message: "Invalid Link" });
  let short_code: string = "";
  if (body.custom_sc) {
    let search = db.get(body.custom_sc);
    if (search !== null) return makeResponse(409, { message: "Short code already used" })
    short_code = body.custom_sc;
  } else {
    const buffer = randomBytes(2);
    short_code = Date.now().toString(16) + buffer.toString("hex");
  }

  // Générer Delete Token
  let hasher = Bun.CryptoHasher("sha256");
  hasher.update(Buffer.from(randomBytes(256)));
  let delete_token = hasher.digest("hex");

  let dbReq = await db.create(body.link, short_code, body.expiration, hashedPassword, delete_token);
  if (!dbReq) return makeResponse(500, { message: "An error has occurred on the server. Please try again." });

  return makeResponse(200, { message: "Link has been successfully shortened.", data: dbReq })

}