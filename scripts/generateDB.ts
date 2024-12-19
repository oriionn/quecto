import SQLiteDataHandler from "~/utils/db";

async function main() {
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