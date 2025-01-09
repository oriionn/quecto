import { parse } from "yaml"

export async function getConfig() {
    "use server";

    // Parse YAML file, "data/config.yml"
    let file = Bun.file("data/config.yml");
    let config = parse(await file.text());

    // Return the parsed YAML file
    return config;
}