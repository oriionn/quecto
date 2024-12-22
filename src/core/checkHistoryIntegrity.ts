import SQLiteDataHandler from "~/utils/db";
import {Link} from "~/models/link";

export async function checkHistoryIntegrity(body: Link[]) {
    "use server";
    const db = new SQLiteDataHandler();
    let dbData = db.getAll();

    let results: string[] = []
    for (const link of body) {
        let search = dbData.find((data) => data.short_code === link.short_code);
        if (search) results.push(link.short_code);
    }

    return results;
}