import { Component } from "solid-js";
import Shorten from "~/components/Shorten";
import History from "~/components/History";
import Unshorten from "~/components/Unshorten";
import {createStore} from "solid-js/store";
import {UserStorage} from "~/models/userStorage";
import {isServer} from "solid-js/web";

export enum ModalType {
  NONE,
  QR_CODE,
  DELETE
}

const Home: Component = () => {
  if (!isServer) {
    const [store, setStore] = createStore<UserStorage>({ history: [] });
    setStore(JSON.parse(localStorage.getItem("quecto") || JSON.stringify({ history: [] })));
    console.log(store);
  }

  const [modal, setModal] = createStore<{
    open: boolean,
    type: ModalType,
    info: string | { short_code: string, delete_token: string }
  }>({
    open: false,
    type: ModalType.NONE,
    info: ""
  });

  return (
    <main class="min-h-screen min-w-screen bg-background text-white font-noto flex flex-col">
      <div class="p-6 sm:(p-12) flex flex-col lg:(grid grid-cols-2 grid-rows-1 gap-12) w-full h-full flex-1">
        <div class="first-col">
          <Shorten store={store} setStore={setStore} />
          <History store={store} setModal={setModal} modal={modal} />
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
    </main>
  );
}

export default Home;