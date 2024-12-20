import { Component, createEffect, createResource, Show, Suspense } from "solid-js";
import Shorten from "~/components/Shorten";
import History from "~/components/History";
import Unshorten from "~/components/Unshorten";
import {createStore} from "solid-js/store";
import {UserStorage} from "~/models/userStorage";
import QRCode from "qrcode"

export enum ModalType {
  NONE,
  QR_CODE,
  DELETE
}

const Home: Component = () => {
  const [store, setStore] = createStore<UserStorage>({ history: [] });

  createEffect(() => {
    setStore(JSON.parse(localStorage.getItem("quecto") || JSON.stringify({ history: [] })));    
  })

  const [modal, setModal] = createStore<{
    open: boolean,
    type: ModalType,
    info: string | { short_code: string, delete_token: string }
  }>({
    open: false,
    type: ModalType.NONE,
    info: ""
  });

  const [qrcode] = createResource(async () => {
    return await QRCode.toDataURL(`https://s.oriondev.fr/${modal.info as string}`)
  })

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

      <Show when={modal.open === true}>
        <div class="w-screen h-screen fixed top-0 left-0 z-90" style={{
          "backdrop-filter": "blur(20px)"
        }}></div>
        <div class="w-screen h-screen fixed top-0 left-0 z-100 flex justify-center items-center">
          <div class="rounded-lg">
            <Show when={modal.type === ModalType.QR_CODE}>
              <div class="flex flex-col justify-center items-center">
                <h1 class="text-lg mb-5 font-bold">Here is your QR Code for your shortened link</h1>
                <div class="w-65 h-65 relative flex justify-center items-center">
                  <div
                    class="absolute w-[20px] h-[20px] top-0 right-0 border-r-(white solid [1px]) border-t-(white solid [1px])"></div>
                  <div
                    class="absolute w-[20px] h-[20px] bottom-0 left-0 border-l-(white solid [1px]) border-b-(white solid [1px])"></div>
                  <div
                    class="absolute w-[20px] h-[20px] bottom-0 right-0 border-r-(white solid [1px]) border-b-(white solid [1px])"></div>
                  <div
                    class="absolute w-[20px] h-[20px] top-0 left-0 border-l-(white solid [1px]) border-t-(white solid [1px])"></div>
                  <Suspense>
                    <img src={qrcode()} class="w-50 h-50"/>
                  </Suspense>
                </div>
                <button class="bg-button hover:bg-button-hover w-5/4 py-2 rounded-lg mt-10 cursor-pointer text-black" onClick={() => setModal({
                  open: false,
                  type: ModalType.NONE,
                  info: ""
                })}>Fermer</button>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </main>
  );
}

export default Home;