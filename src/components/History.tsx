import {Component, createResource, For, Show, Suspense} from "solid-js";
import {QrCode, Trash} from "lucide-solid";
import {UserStorage} from "~/models/userStorage";
import {ModalType} from "~/routes";
import {SetStoreFunction} from "solid-js/store";



const History: Component<{ store: UserStorag, modal: {
    open: boolean,
    type: ModalType,
    info: string | { short_code: string, delete_token: string }
  }, setModal: SetStoreFunction<{
    open: boolean,
    type: ModalType,
    info: string | { short_code: string, delete_token: string }
  }> }> = (props) => {
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
                  <a href={`https://s.oriondev.fr/${link.short_code}`} class="text-blue-500 hover:text-blue-400"
                     target="_blank">https://s.oriondev.fr/{link.short_code}</a>
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



export default History;