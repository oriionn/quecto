import {Config} from "~/models/config";
import SQLiteDataHandler from "~/utils/db";
import {stringify} from "yaml";
import {verifyDir} from "./globals";

const configTemplate: Config = {
    instance: "",
    domain: "",
    ssl: true,
    authorize_custom_shortcode: true,
    expirations: [
        {name: "Unlimited", minutes: 0},
        {name: "5 minutes", minutes: 5},
        {name: "10 minutes", minutes: 10},
        {name: "30 minutes", minutes: 30},
        {name: "1 hour", minutes: 60},
        {name: "1 day", minutes: 1440},
        {name: "1 week", minutes: 10080},
        {name: "1 month", minutes: 43200},
        {name: "1 year", minutes: 525600}
    ]
}

async function main() {
    await verifyDir();

    let file = Bun.file("data/config.yml")
    if (await file.exists()) {
        console.log("A config is already exists.")
    } else {
        Bun.write("data/config.yml", stringify(configTemplate))
        console.log("Config was successfuly created.");
    }
}

main()