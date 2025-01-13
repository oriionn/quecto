import {makeResponse} from "~/utils/response";
import SQLiteDataHandler from "~/utils/db";
import {ShortenRequest} from "~/models/requests";
import {randomBytes} from "crypto";
import {getConfig} from "~/core/getConfig";

export async function shorten(body: ShortenRequest) {
  "use server";
  const db = new SQLiteDataHandler();
  const config = await getConfig();

  // Traiter les informations
  let hashedPassword = null;
  if (body.password) hashedPassword = await Bun.password.hash(body.password);
  let linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  if (!linkRegex.test(body.link)) return makeResponse(400, { message: "Invalid Link" });
  let short_code: string = "";
  if (body.custom_sc && config.authorize_custom_shortcode) {
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
  let hashedDeleteToken = await Bun.password.hash(delete_token);

  let dbReq = await db.create(body.link, short_code, body.expiration, hashedPassword, hashedDeleteToken);
  if (!dbReq) return makeResponse(500, { message: "An error has occurred on the server. Please try again." });

  return makeResponse(200, { message: "Link has been successfully shortened.", data: {...dbReq, delete_token} })

}