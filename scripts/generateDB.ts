import SQLiteDataHandler from "~/utils/db";
import {verifyDir} from "./globals";

async function main() {
    await verifyDir();

    let file = Bun.file("data/db.sqlite")
    if (await file.exists()) { 
        console.log("A database is already exists.")
    } else {
        Bun.write("data/db.sqlite", "")
        new SQLiteDataHandler();
        console.log("Database was successfuly created.");
    }   
}

main()