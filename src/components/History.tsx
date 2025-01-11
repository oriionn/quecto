import {Component, createEffect, createResource, For, Show, Suspense} from "solid-js";
import {QrCode, Trash} from "lucide-solid";
import {UserStorage} from "~/models/userStorage";
import {ModalType, Modal as ModalInterface} from "~/models/modal";
import {SetStoreFunction} from "solid-js/store";
import {checkHistoryIntegrity} from "~/core/checkHistoryIntegrity";
import {Link} from "~/models/link";
import toast from "solid-toast";
import {Config} from "~/models/config";

const History: Component<{ store: UserStorage, setStore: SetStoreFunction<UserStorage>, modal: ModalInterface, setModal: SetStoreFunction<ModalInterface>, config: Config | undefined }> = (props) => {
  if (!props.config) return <div class="card flex justify-center items-center">Loading...</div>;

  createEffect(async () => {
    if (props.store.history.length > 0) {
      let data = await fetchHistoryIntegrity(props.store.history);
      if (data.status !== 200) return toast.error(data.message);
      let historyIntegrity = data.data;
      if (historyIntegrity.length === 0) localStorage.setItem("quecto", JSON.stringify({ history: [] }))

      if (historyIntegrity.length !== props.store.history.length) {
        let history = props.store.history.filter((link) => historyIntegrity.includes(link.short_code));
        localStorage.setItem("quecto", JSON.stringify({...props.store, history }));
        props.setStore({...props.store, history });
      }
    }
  })

  return (
    <div class="card flex flex-col mt-2">
      <h1 class="text-2xl mb-5 font-bold">History</h1>
      <table>
        <thead>
          <tr>
            <th class="hidden xl:block">Original</th>
            <th>Shortened</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.store.history}>{(link) => (
              <tr>
                <td class="hidden xl:table-cell text-center">
                  <a href={link.link} class="text-blue-500 hover:text-blue-400"
                     target="_blank">{link.link}</a>
                </td>
                <td class="text-center table-cell">
                  <a href={`${props.config?.ssl ? "https":"http"}://${props.config?.domain}/${link.short_code}`} class="text-blue-500 hover:text-blue-400"
                     target="_blank"><span class="inline-block">${props.config?.ssl ? "https":"http"}://{props.config?.domain}</span>/{link.short_code}</a>
                </td>
                <td class="flex flex-row gap-2 justify-end pt-2">
                  <button
                    class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
                    title="Generate a QR Code for the shortened link" onClick={() => {
                      props.setModal({
                        open: true,
                        type: ModalType.QR_CODE,
                        info: link.short_code
                      })
                  }}><QrCode size={16}/></button>
                  <button
                    class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
                    title="Delete link from the history" onClick={() => {
                      props.setModal({
                        open: true,
                        type: ModalType.DELETE,
                        info: {
                          short_code: link.short_code,
                          delete_token: link.delete_token
                        }
                      })
                  }}><Trash size={16}/></button>
                </td>
              </tr>
            )
          }</For>
        </tbody>
      </table>
    </div>
  )
}

async function fetchHistoryIntegrity(history: Link[]) {
  "use server";
  let res = await checkHistoryIntegrity(history);
  if (res.status === 200) return await res.json();
  return { status: 500, message: "An error occurred while checking the history integrity" };
}

export default History;