import {Component, createEffect, createSignal, Show} from "solid-js";
import Shorten from "~/components/Shorten";
import History from "~/components/History";
import Unshorten from "~/components/Unshorten";
import {createStore} from "solid-js/store";
import {UserStorage} from "~/models/userStorage";
import {createAsync, query, useSearchParams} from "@solidjs/router";
import Toaster from "~/components/Toaster";
import {Modal as ModalInterface, ModalType} from "~/models/modal";
import Modal from "~/components/Modal";
import {Config} from "~/models/config";
import Meta from "~/components/Meta";

const config = query(async () => {
    "use server";
    const { getConfig } = await import("~/core/getConfig");
    return await getConfig();
}, "config");

export const route = {
    preload: () => config(),
}

const Home: Component = () => {
    const [store, setStore] = createStore<UserStorage>({ history: [] });
    const configData = createAsync<Config>((): Promise<Config> => config());

    createEffect(() => {
        setStore(JSON.parse(localStorage.getItem("quecto") || JSON.stringify({ history: [] })));
    })

    const [modal, setModal] = createStore<ModalInterface>({
        open: false,
        type: ModalType.NONE,
        info: ""
    });

    return (
        <main class="min-h-screen min-w-screen bg-background text-white font-noto flex flex-col overflow-x-hidden">
            <Meta config={configData()} title="Home" />
            <div class="p-6 sm:(p-12) flex flex-col lg:(grid grid-cols-2 grid-rows-1 gap-12) w-full h-full flex-1">
                <div class="first-col">
                    <Shorten store={store} setStore={setStore} config={configData()} />
                    <Show when={store.history.length > 0}>
                        <History store={store} setModal={setModal} modal={modal} setStore={setStore} config={configData()} />
                    </Show>
                </div>
                <div class="second-col mt-2 lg:mt-0">
                    <Unshorten config={configData()} />
                </div>
            </div>
            <footer class="p-5 flex flex-row flex-wrap gap-x-2">
                <a href="https://github.com/oriionn/quecto" class="text-blue-500 hover:text-blue-400" target="_blank">Source
                    code</a>
                <span>•</span>
                <a href="https://quecto.oriondev.fr/docs" class="text-blue-500 hover:text-blue-400"
                   target="_blank">Documentation</a>
                <span>•</span>
                <span>Under license <a href="https://choosealicense.com/licenses/gpl-3.0/"
                                       class="text-blue-500 hover:text-blue-400"
                                       target="_blank">GPL 3.0</a></span>
                <span>•</span>
                <span>Made with <span class="font-emoji">❤</span> by <a href="https://github.com/oriionn"
                                                                        class="text-blue-500 hover:text-blue-400"
                                                                        target="_blank">Orion</a></span>
            </footer>

            <Modal modal={modal} setModal={setModal} store={store} setStore={setStore} config={configData()} />
            <Toaster />
        </main>
    );
}

export default Home;
export {config}