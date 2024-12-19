import type { APIEvent } from "@solidjs/start/server";
import {randomBytes} from "crypto";
import SQLiteDataHandler from "~/utils/db";
import { ShortenRequest } from "~/models/requests";
import { makeResponse } from "~/utils/response";
import {shorten} from "~/core/shorten";

export async function POST(req: APIEvent) {
    "use server";
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

    return await shorten(body);
}