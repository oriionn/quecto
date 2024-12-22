import {APIEvent} from "@solidjs/start/dist/server";
import {makeResponse} from "~/utils/response";
import SQLiteDataHandler from "~/utils/db";
import {redirect} from "@solidjs/router";
import NotFound from "~/routes/[...404]";
import Home from "~/routes/index";

const DATE_GAP = (1000 * 60 * 60) + 500;

export async function GET(event: APIEvent) {
    if (!event.params.short_id) return;
    "use server";
    let {short_id} = event.params;
    let db = new SQLiteDataHandler();
    let search = db.get(short_id, true);
    if (!search) return redirect(`/404/${short_id}`)
    if (search.password) return redirect(`/password/${short_id}`);
    if (search.expiration > 0 && Date.now() - (new Date(search.created_at).getTime() + DATE_GAP) > search.expiration * 1000 * 60) {
        db.delete(short_id);
        return redirect(`/404/${short_id}`);
    }

    return redirect(search.link);
}