import { Component, createEffect, createResource, Show, Suspense } from "solid-js";
import Shorten from "~/components/Shorten";
import History from "~/components/History";
import Unshorten from "~/components/Unshorten";
import {createStore} from "solid-js/store";
import {UserStorage} from "~/models/userStorage";
import QRCode from "qrcode"
import {LucideHistory, Trash} from "lucide-solid";
import toast from "solid-toast";
import {RouteDefinition, useSearchParams} from "@solidjs/router";
import Toaster from "~/components/Toaster";

export enum ModalType {
  NONE,
  QR_CODE,
  DELETE
}

enum ErrorType {
  LINK_NOT_FOUND = "Link not found",
  INVALID_TOKEN = "Invalid token",
  SERVER_ERROR = "An error has occurred on the server. Please try again."
}

const Home: Component = () => {
  const [store, setStore] = createStore<UserStorage>({ history: [] });
  const [searchParams, setSearchParams] = useSearchParams();

  createEffect(() => {
    setStore(JSON.parse(localStorage.getItem("quecto") || JSON.stringify({ history: [] })));

    if (searchParams.not_found) setTimeout(() => {
      toast.error("Link not found");
    }, 1000)
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

      <Show when={modal.open}>
        <div class="w-screen h-screen fixed top-0 left-0 z-90" style={{
          "backdrop-filter": "blur(20px)"
        }}></div>
        <div class="w-screen h-screen fixed top-0 left-0 z-100 flex justify-center items-center">
          <div class="rounded-lg">
            <Show when={modal.type === ModalType.QR_CODE}>
              <div class="flex flex-col justify-center items-center mx-1/10">
                <h1 class="text-lg mb-5 font-bold text-center">Here is your QR Code for your shortened link</h1>
                <div class="w-75 h-75 relative flex justify-center items-center">
                  <div
                    class="absolute w-[20px] h-[20px] top-0 right-0 border-r-(white solid [1px]) border-t-(white solid [1px])"></div>
                  <div
                    class="absolute w-[20px] h-[20px] bottom-0 left-0 border-l-(white solid [1px]) border-b-(white solid [1px])"></div>
                  <div
                    class="absolute w-[20px] h-[20px] bottom-0 right-0 border-r-(white solid [1px]) border-b-(white solid [1px])"></div>
                  <div
                    class="absolute w-[20px] h-[20px] top-0 left-0 border-l-(white solid [1px]) border-t-(white solid [1px])"></div>
                  <Suspense>
                    <img src={qrcode()} class="w-60 h-60"/>
                  </Suspense>
                </div>
                <button class="bg-button hover:bg-button-hover w-11/10 py-2 rounded-lg mt-10 cursor-pointer text-black" onClick={() => setModal({
                  open: false,
                  type: ModalType.NONE,
                  info: ""
                })}>Close</button>
              </div>
            </Show>
            <Show when={modal.type === ModalType.DELETE}>
              <div class="flex flex-col justify-center items-center mx-1/10">
                <h1 class="text-lg w-9/10 sm:w-110 mb-5">Do you want to totally delete this link or juste delete from your history
                  ? <span class="font-bold">This action is irreversible</span></h1>
                <div class="flex flex-col sm:flex-row gap-5">
                  <button
                    class="bg-transparent border-(white solid 2) w-50 h-50 rounded-lg outline-none flex flex-col gap-5 justify-center items-center" onClick={() => {
                    let history = store.history.filter((link) => link.short_code !== (modal.info as { short_code: string, delete_token: string }).short_code);
                    localStorage.setItem("quecto", JSON.stringify({...store, history}));
                    setStore({...store, history });
                    setModal({
                      open: false,
                      type: ModalType.NONE,
                      info: ""
                    })
                    toast.success("Link successfully deleted from your history");
                  }}>
                    <LucideHistory size={32}/>
                    <span class="mx-2">Delete from your history</span>
                  </button>
                  <button
                    class="bg-transparent border-(white solid 2) w-50 h-50 rounded-lg outline-none flex flex-col gap-5 justify-center items-center"
                    onClick={async () => {
                      let data = await deleteInServer((modal.info as { short_code: string, delete_token: string }).short_code, (modal.info as { short_code: string, delete_token: string }).delete_token);
                      if (!data) return toast.error("An error has occurred. Please try again.");

                      if (data.status !== 200) {
                        switch (data.message) {
                          case ErrorType.LINK_NOT_FOUND:
                            let history = store.history.filter((link) => link.short_code !== (modal.info as { short_code: string, delete_token: string }).short_code);
                            localStorage.setItem("quecto", JSON.stringify({...store, history}));
                            setStore({...store, history });
                            setModal({
                              open: false,
                              type: ModalType.NONE,
                              info: ""
                            })
                            return toast.error("Link not found");
                          case ErrorType.INVALID_TOKEN:
                            return toast.error("Invalid token");
                          case ErrorType.SERVER_ERROR:
                            return toast.error("An error has occurred on the server. Please try again.");
                          default:
                            return toast.error("An error has occurred. Please try again.");
                        }
                      }

                      let history = store.history.filter((link) => link.short_code !== (modal.info as { short_code: string, delete_token: string }).short_code);
                      localStorage.setItem("quecto", JSON.stringify({...store, history}));
                      setStore({...store, history });
                      setModal({
                        open: false,
                        type: ModalType.NONE,
                        info: ""
                      })
                      toast.success("Link successfully deleted");

                    }}>
                    <LucideHistory size={32}/>
                    <span class="mx-2">Total delete (in your history and server)</span>
                  </button>
                </div>
                <button
                  class="bg-button hover:bg-button-hover w-11/10 py-2 rounded-lg mt-10 cursor-pointer text-black"
                  onClick={() => setModal({
                    open: false,
                    type: ModalType.NONE,
                    info: ""
                  })}>Close
                </button>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      <Toaster />
    </main>
  );
}

async function deleteInServer(short_code: string, delete_token: string) {
  "use server";
  const {deleteLink} = await import("~/core/delete");
  return (await deleteLink({ short_code, token: delete_token })).json();
}

export const route = {
  path: "/",
  component: Home,
} satisfies RouteDefinition

export default Home;