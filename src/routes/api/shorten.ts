import type { APIEvent } from "@solidjs/start/server";
import {randomBytes} from "crypto";
import SQLiteDataHandler from "../../../utils/db";
import { ShortenRequest } from "../../../models/requests";
import { makeResponse } from "../../../utils/response";

export async function POST(req: APIEvent) {
    const db = new SQLiteDataHandler();

    // Vérification si l'utilisateur a fourni un body
    let requestClone = req.request.clone();
    let rawBody = await req.request.text();
    if (!rawBody) return makeResponse(400, {message: "No body"});
    req.request = requestClone;

    // Vérification de la validité du body
    let body: ShortenRequest = await req.request.json();
    let testBody = ShortenRequest.safeParse(body);
    if (!testBody.success) return makeResponse(400, {message: "Invalid body"})
    body = testBody.data;

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
    
    let dbReq = db.create(body.link, short_code, body.expiration, hashedPassword);
    if (!dbReq) return makeResponse(500, { message: "An error has occurred on the server. Please try again." });

    return makeResponse(200, { message: "Link has been successfully shortened.", data: dbReq })
}