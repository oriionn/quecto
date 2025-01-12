import {getConfig} from "~/core/getConfig";
import {makeResponse} from "~/utils/response";

export async function GET() {
    "use server";

    const config = await getConfig();
    return makeResponse(200, { message: "Config is here", data: config });
}