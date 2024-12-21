import { Component, createEffect, Show } from "solid-js";
import Shorten from "~/components/Shorten";
import History from "~/components/History";
import Unshorten from "~/components/Unshorten";
import {createStore} from "solid-js/store";
import {UserStorage} from "~/models/userStorage";
import toast from "solid-toast";
import {useSearchParams} from "@solidjs/router";
import Toaster from "~/components/Toaster";
import {Modal as ModalInterface, ModalType} from "~/models/modal";
import Modal from "~/components/Modal";

const Home: Component = () => {
  const [store, setStore] = createStore<UserStorage>({ history: [] });
  const [searchParams, setSearchParams] = useSearchParams();

  createEffect(() => {
    setStore(JSON.parse(localStorage.getItem("quecto") || JSON.stringify({ history: [] })));

    if (searchParams.not_found) setTimeout(() => {
      toast.error("Link not found");
    }, 1000)
  })

  const [modal, setModal] = createStore<ModalInterface>({
    open: false,
    type: ModalType.NONE,
    info: ""
  });

  return (
    <main class="min-h-screen min-w-screen bg-background text-white font-noto flex flex-col">
      <div class="p-6 sm:(p-12) flex flex-col lg:(grid grid-cols-2 grid-rows-1 gap-12) w-full h-full flex-1">
        <div class="first-col">
          <Shorten store={store} setStore={setStore} />
          <Show when={store.history.length > 0}>
            <History store={store} setModal={setModal} modal={modal} />
          </Show>
        </div>
        <div class="second-col mt-2 lg:mt-0">
          <Unshorten />
        </div>
      </div>
      <footer class="p-5 flex flex-row flex-wrap gap-x-2">
        <a href="https://github.com/oriionn/quecto" class="text-blue-500 hover:text-blue-400" target="_blank">Source
          code</a>
        <span>•</span>
        <a href="https://github.com/oriionn/quecto" class="text-blue-500 hover:text-blue-400"
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

      <Modal modal={modal} setModal={setModal} store={store} setStore={setStore} />
      <Toaster />
    </main>
  );
}

export default Home;