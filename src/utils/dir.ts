import { access } from "node:fs/promises";
import { constants } from "node:fs";

export async function dirExists(path: string) {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}