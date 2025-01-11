import {dirExists} from "~/utils/dir";
import {mkdir} from "node:fs/promises";

export async function verifyDir() {
    if (await dirExists("data")) return;
    await mkdir("data");
}