import {ChevronDown, ChevronUp, Eye, EyeOff, QrCode, Trash} from "lucide-solid";
import { children, Component, createSignal, ParentComponent, Show } from "solid-js";
import Shorten from "~/components/Shorten";

const Home: Component = () => {
  return (
    <main class="min-h-screen min-w-screen bg-background text-white font-noto">
      <div class="p-12 gap-12 grid grid-cols-2 grid-rows-1 w-full h-full">
        <div class="first-col">
          <Shorten />
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
                <a href="https://google.com" className="text-blue-500 text-lg hover:text-blue-400"
                   target="_blank">https://google.com</a>
              </div>
              <div class="center">
                <a href="https://s.oriondev.fr/abcde" className="text-blue-500 text-lg hover:text-blue-400"
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
        </div>
        <div class="second-col">
          <div class="card">
            <h1 class="text-2xl font-bold">Unshorten a link</h1>
            <input type="text" class="input" id="shortened-link" name="shortened-link" placeholder="Your link"/>
            <div class="final w-full flex flex-row justify-end mt-3">
              <button
                class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-black">Unshorten
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;