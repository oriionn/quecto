import {SetStoreFunction} from "solid-js/store";
import {Modal as ModalInterface, ModalInfo, ModalType} from "~/models/modal";
import {Component, createResource, Show, Suspense} from "solid-js";
import toast from "solid-toast";
import {LucideHistory} from "lucide-solid";
import QRCode from "qrcode";
import {UserStorage} from "~/models/userStorage";

enum ErrorType {
  LINK_NOT_FOUND = "Link not found",
  INVALID_TOKEN = "Invalid token",
  SERVER_ERROR = "An error has occurred on the server. Please try again."
}

const Modal: Component<{ modal: ModalInterface, setModal: SetStoreFunction<ModalInterface>, store: UserStorage, setStore: SetStoreFunction<UserStorage> }> = (props) => {
  const [qrcode] = createResource(async () => {
    return QRCode.toDataURL(`https://s.oriondev.fr/${props.modal.info as string}`);
  })

  return (
    <Show when={props.modal.open}>
      <div class="w-screen h-screen fixed top-0 left-0 z-90" style={{
        "backdrop-filter": "blur(20px)"
      }}></div>
      <div class="w-screen h-screen fixed top-0 left-0 z-100 flex justify-center items-center">
        <div class="rounded-lg">
          <Show when={props.modal.type === ModalType.QR_CODE}>
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
                  <img src={qrcode()} class="w-60 h-60" alt={`QRCode for ${props.modal.info as string}`} />
                </Suspense>
              </div>
              <button class="bg-button hover:bg-button-hover w-11/10 py-2 rounded-lg mt-10 cursor-pointer text-black" onClick={() => props.setModal({
                open: false,
                type: ModalType.NONE,
                info: ""
              })}>Close</button>
            </div>
          </Show>
          <Show when={props.modal.type === ModalType.DELETE}>
            <div class="flex flex-col justify-center items-center mx-1/10">
              <h1 class="text-lg w-9/10 sm:w-110 mb-5">Do you want to totally delete this link or juste delete from your history
                ? <span class="font-bold">This action is irreversible</span></h1>
              <div class="flex flex-col sm:flex-row gap-5">
                <button
                  class="bg-transparent border-(white solid 2) w-50 h-50 rounded-lg outline-none flex flex-col gap-5 justify-center items-center" onClick={() => {
                  let history = props.store.history.filter((link) => link.short_code !== (props.modal.info as ModalInfo).short_code);
                  localStorage.setItem("quecto", JSON.stringify({...props.store, history}));
                  props.setStore({...props.store, history });
                  props.setModal({
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
                    let data = await deleteInServer((props.modal.info as ModalInfo).short_code, (props.modal.info as ModalInfo).delete_token);
                    if (!data) return toast.error("An error has occurred. Please try again.");

                    if (data.status !== 200) {
                      switch (data.message) {
                        case ErrorType.LINK_NOT_FOUND:
                          let history = props.store.history.filter((link) => link.short_code !== (props.modal.info as ModalInfo).short_code);
                          localStorage.setItem("quecto", JSON.stringify({...props.store, history}));
                          props.setStore({...props.store, history });
                          props.setModal({
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

                    let history = props.store.history.filter((link) => link.short_code !== (props.modal.info as ModalInfo).short_code);
                    localStorage.setItem("quecto", JSON.stringify({...props.store, history}));
                    props.setStore({...props.store, history });
                    props.setModal({
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
                onClick={() => props.setModal({
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
  )
}

async function deleteInServer(short_code: string, delete_token: string) {
  "use server";
  const {deleteLink} = await import("~/core/delete");
  return (await deleteLink({ short_code, token: delete_token })).json();
}

export default Modal;