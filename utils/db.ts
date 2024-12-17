import { Database } from "bun:sqlite";
import { Link } from "../models/link";

class SQLiteDataHandler {
    private db: Database;

    constructor() {
        this.db = new Database("data/db.sqlite", {strict: true})

        this.db
        .query(`CREATE TABLE IF NOT EXISTS links (short_code TEXT PRIMARY KEY, link TEXT NOT NULL, expiration INT NOT NULL, password TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
        .run()
    }

    get(short_code: string, password?: boolean) {
        if (password) {
            let query = this.db.prepare("SELECT * FROM links WHERE short_code = $short_code");
            let results = query.get({short_code})
            return results;
        }
        let query = this.db.prepare("SELECT short_code, link, expiration, created_at FROM links WHERE short_code = $short_code");
        let results: Link = query.get({short_code})
        return results;
    }

    getAll() {
        let query = this.db.prepare("SELECT short_code, link, expiration, created_at FROM links")
        let results: Link[] = query.all()

        return results;
    }

    create(link: string, short_code: string, expiration: number, password?: string): Link | null {
        let query = this.db.prepare("INSERT INTO links (short_code, link, expiration, password) VALUES ($short_code, $link, $expiration, $password);");
        try {
            query.run({ short_code, link, expiration, password });
            return {
                short_code, link, expiration
            }
        } catch (error) {            
            return null;
        }
    }
}

export default SQLiteDataHandler;