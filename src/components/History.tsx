import {Component} from "solid-js";
import {QrCode, Trash} from "lucide-solid";

const History: Component = () => {
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
        <tr>
          <td class="hidden xl:table-cell text-center">
            <a href="https://google.com" className="text-blue-500 hover:text-blue-400"
               target="_blank">https://google.com</a>
          </td>
          <td class="text-center table-cell">
            <a href="https://s.oriondev.fr/abcde" className="text-blue-500 hover:text-blue-400"
               target="_blank">https://s.oriondev.fr/abcde</a>
          </td>
          <td class="flex flex-row gap-2 justify-end pt-2">
            <button
              class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
              title="Generate a QR Code for the shortened link"><QrCode size={16}/></button>
            <button
              class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
              title="Delete link from the history"><Trash size={16}/></button>
          </td>
        </tr>
        <tr>
          <td class="hidden xl:table-cell text-center">
            <a href="https://google.com" class="text-blue-500 hover:text-blue-400"
               target="_blank">https://google.com</a>
          </td>
          <td class="text-center table-cell">
            <a href="https://s.oriondev.fr/abcde" class="text-blue-500 hover:text-blue-400"
               target="_blank">https://s.oriondev.fr/abcde</a>
          </td>
          <td class="flex flex-row gap-2 justify-end pt-2">
            <button
              class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
              title="Generate a QR Code for the shortened link"><QrCode size={16}/></button>
            <button
              class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
              title="Delete link from the history"><Trash size={16}/></button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

export default History;