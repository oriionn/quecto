import { Database } from "bun:sqlite";

class SQLiteDataHandler {
    private db: Database;

    constructor() {
        this.db = new Database("data/db.sqlite")

        this.db
        .query(`CREATE TABLE IF NOT EXISTS links (short_code TEXT PRIMARY KEY, link TEXT NOT NULL, expiration INT NOT NULL, password TEXT)`)
        .run()
    }
}

export default SQLiteDataHandler;