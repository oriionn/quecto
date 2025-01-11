import {parse} from "yaml"

export async function getConfig() {
    "use server";
    let file = Bun.file("data/config.yml");

    // Return the parsed YAML file
    return parse(await file.text());
}