import SQLiteDataHandler from "~/utils/db";
import {Link} from "~/models/link";
import {DATE_GAP} from "~/routes/[short_id]";
import {makeResponse} from "~/utils/response";

export async function checkHistoryIntegrity(body: Link[]) {
    "use server";
    const db = new SQLiteDataHandler();
    let dbData = db.getAll();

    let results: string[] = []
    for (const link of body) {
        let search = dbData.find((data) => data.short_code === link.short_code);
        if (search) {
            if (!(search.expiration > 0 && Date.now() - (new Date(search.created_at).getTime() + DATE_GAP) > search.expiration * 1000 * 60)) {
                results.push(link.short_code);
            }
        }
    }

    return makeResponse(200, {message: "Integrity check complete", data: results});
}