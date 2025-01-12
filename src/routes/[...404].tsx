import {A, createAsync} from "@solidjs/router";
import {config} from "~/routes/index";
import {MetaProvider, Title} from "@solidjs/meta";
import { Config } from "~/models/config";
import Meta from "~/components/Meta";

export const route = {
    preload: () => config(),
}

export default function NotFound() {
    const configData = createAsync<Config>((): Promise<Config> => config());

    return (
        <main class="text-center mx-auto text-gray-700 p-4">
            <Meta config={configData()} title="Not found" />
        </main>
    );
}
