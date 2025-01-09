import { Link, ZLink } from "~/models/link";
import {makeResponse} from "~/utils/response";
import {checkHistoryIntegrity} from "~/core/checkHistoryIntegrity";
import {APIEvent} from "@solidjs/start/dist/server";

export async function GET(req: APIEvent) {
    "use server";

    // Vérification si l'utilisateur a fourni un body
    let requestClone = req.request.clone();
    let rawBody = await req.request.text();
    if (!rawBody) return makeResponse(400, {message: "No body"});
    req.request = requestClone;

    // Vérification de la validité du body
    let body: Link[] = await req.request.json();
    if (!Array.isArray(body)) return makeResponse(400, {message: "Body must be an array"})
    if (body.length === 0) return makeResponse(400, {message: "Body must not be empty"})
    let safeBody: Link[] = [];
    for (l of body) {
        let testBody = ZLink.safeParse(l);
        if (!testBody.success) return makeResponse(400, {message: "Invalid body"})
        safeBody.push(testBody.data as Link);
    }
    body = safeBody;

    return await checkHistoryIntegrity(body);
}