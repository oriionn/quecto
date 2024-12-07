import {Component} from "solid-js";

const Unshorten: Component = () => {
  return (
    <div class="card">
      <h1 class="text-2xl font-bold">Unshorten a link</h1>
      <input type="text" class="input" id="shortened-link" name="shortened-link" placeholder="Your link"/>
      <div class="final w-full flex flex-row justify-end mt-3">
        <button
          class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-black">Unshorten
        </button>
      </div>
    </div>
  )
}

export default Unshorten;