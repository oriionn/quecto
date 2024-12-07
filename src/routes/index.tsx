import { Component } from "solid-js";
import Shorten from "~/components/Shorten";
import History from "~/components/History";
import Unshorten from "~/components/Unshorten";

const Home: Component = () => {
  return (
    <main class="min-h-screen min-w-screen bg-background text-white font-noto">
      <div class="p-12 gap-12 grid grid-cols-2 grid-rows-1 w-full h-full">
        <div class="first-col">
          <Shorten />
          <History />
        </div>
        <div class="second-col">
          <Unshorten />
        </div>
      </div>
    </main>
  );
}

export default Home;