import {APIEvent} from "@solidjs/start/dist/server";
import {hasPassword} from "~/core/hasPassword";

export async function GET(req: APIEvent) {
    if (!req.params.short_id) return;
    "use server";

    let short_code = req.params.short_id;
    return hasPassword({short_code});
}