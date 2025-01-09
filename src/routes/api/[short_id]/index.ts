import {APIEvent} from "@solidjs/start/dist/server";
import SQLiteDataHandler from "~/utils/db";
import {makeResponse} from "~/utils/response";
import {DeleteRequest, ShortenRequest} from "~/models/requests";
import {deleteLink} from "~/core/delete";
import {hasPassword} from "~/core/hasPassword";
import {unshorten} from "~/core/unshorten";

export async function DELETE(req: APIEvent) {
    if (!req.params.short_id) return;
    "use server";

    let short_code = req.params.short_id;

    // Vérification si l'utilisateur a fourni un body
    let requestClone = req.request.clone();
    let rawBody = await req.request.text();
    if (!rawBody) return makeResponse(400, {message: "No body"});
    req.request = requestClone;

    // Vérification de la validité du body
    let body: ShortenRequest = await req.request.json();
    body = {...body, short_code};
    let testBody = DeleteRequest.safeParse(body);
    if (!testBody.success) return makeResponse(400, {message: "Invalid body"})
    body = testBody.data;

    return await deleteLink(body);
}

export async function GET(req: APIEvent) {
    if (!req.params.short_id) return;
    "use server";

    let short_code = req.params.short_id;
    let hasPasswordBody = await hasPassword({ short_code });
    if (hasPasswordBody.status !== 200) return hasPasswordBody;
    let hPassword = (await hasPasswordBody.json()).data;

    // Vérification si l'utilisateur a fourni un header Authorization
    if (hPassword) {
        if (!req.request.headers.get("Authorization")) return makeResponse(401, {message: "No password provided"});
        let password = req.request.headers.get("Authorization");

        if (password.startsWith("Basic ")) password = password.slice(6);
        else return makeResponse(401, {message: "Invalid authorization format"});
        const buffer = Buffer.from(password, "base64");
        password = buffer.toString("utf-8");

        return unshorten({ short_code, password });
    } else {
        return unshorten({ short_code });
    }
}