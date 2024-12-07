import {Component} from "solid-js";
import {QrCode, Trash} from "lucide-solid";

const History: Component = () => {
  return (
    <div class="card flex flex-col mt-2">
      <h1 class="text-2xl mb-5 font-bold">History</h1>
      <div class="flex flex-row justify-between items-center">
        <span class="text-lg">Original link</span>
        <span class="text-lg">Shortened link</span>
        <span class="text-lg">Actions</span>
      </div>
      <div class="flex flex-row justify-between items-center mt-2">
        <div class="left">
          <a href="https://google.com" class="text-blue-500 text-lg hover:text-blue-400"
             target="_blank">https://google.com</a>
        </div>
        <div class="center">
          <a href="https://s.oriondev.fr/abcde" class="text-blue-500 text-lg hover:text-blue-400"
             target="_blank">https://s.oriondev.fr/abcde</a>
        </div>
        <div class="right flex flex-row gap-2">
          <button
            class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
            title="Generate a QR Code for the shortened link"><QrCode size={16}/></button>
          <button
            class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
            title="Delete link from the history"><Trash size={16}/></button>
        </div>
      </div>
      <div class="flex flex-row justify-between items-center mt-2">
        <div class="left">
          <a href="https://google.com" class="text-blue-500 text-lg hover:text-blue-400"
             target="_blank">https://google.com</a>
        </div>
        <div class="center">
          <a href="https://s.oriondev.fr/abcde" class="text-blue-500 text-lg hover:text-blue-400"
             target="_blank">https://s.oriondev.fr/abcde</a>
        </div>
        <div class="right flex flex-row gap-2">
          <button
            class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
            title="Generate a QR Code for the shortened link"><QrCode size={16}/></button>
          <button
            class="bg-button hover:bg-button-hover p-[0.5rem] border-none outline-none rounded-lg text-black"
            title="Delete link from the history"><Trash size={16}/></button>
        </div>
      </div>
    </div>
  )
}

export default History;