import {ChevronDown, ChevronUp, Eye, EyeOff, QrCode, Trash} from "lucide-solid";
import { children, Component, createSignal, ParentComponent, Show } from "solid-js";

const Home: Component = () => {
  const [passwordProtection, setPasswordProtection] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [useCustomShortCode, setUseCustomShortCode] = createSignal(false);
  const [isSelectOpen, setIsSelectOpen] = createSignal(false);

  return (
    <main class="min-h-screen min-w-screen bg-background text-white font-noto">
      <div class="p-12 gap-12 grid grid-cols-2 grid-rows-1 w-full h-full">
        <div class="first-col">
          <div class="card">
            <h1 class="text-2xl font-bold">Shorten a link</h1>
            <input type="text" class="input" id="link" name="link" placeholder="Your link" />
            <div class="flex flex-row items-center">
              <select
                class="input appearance-none"
                onblur={() => setIsSelectOpen(false)}
                onClick={() => setIsSelectOpen(!isSelectOpen())}
                name="expiration"
                id="expiration"
              >
                <option value="" selected disabled hidden>Expiration time</option>
                <option value="1">1 hour</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
                <option value="72">3 days</option>
                <option value="168">7 days</option>
                <option value="336">2 weeks</option>
              </select>
              <Show when={isSelectOpen()} fallback={<ChevronDown class="ml-[-35px] mt-2" color="black" />}>
                <ChevronUp class="ml-[-35px] mt-2" color="black" />
              </Show>
            </div>
            <Expandable title="More options">
              <div class="flex flex-row justify-between cursor-pointer w-full"
                   onClick={() => setPasswordProtection(!passwordProtection())}>
                <label for="password_protection" class="cursor-pointer" onClick={() => setPasswordProtection(!passwordProtection())}>Protect a link with a password ?</label>
                <input type="checkbox" id="password_protection" name="password_protection" class="!outline-none !border-none mr-[5px]" checked={passwordProtection()} /> 
              </div>
              <Show when={passwordProtection()}>
                <div class="flex flex-row items-center mb-3">
                  <input type={showPassword() ? "text":"password"} class="input" id="password" name="password" placeholder="Password"></input>
                  <Show when={showPassword()} fallback={
                    <Eye onClick={() => setShowPassword(true)} color="black" class="ml-[-35px] mt-2 cursor-pointer" />
                  }>
                    <EyeOff onClick={() => setShowPassword(false)} color="black" class="ml-[-35px] mt-2 cursor-pointer" />
                  </Show>
                </div>
              </Show>

              <div class="flex flex-row justify-between cursor-pointer w-full" onClick={() => setUseCustomShortCode(!useCustomShortCode())}>
                <label for="use_custom_short_code" class="cursor-pointer" onClick={() => setUseCustomShortCode(!useCustomShortCode())}>Use a custom short code ?</label>
                <input type="checkbox" id="use_custom_short_code" name="use_custom_short_code" class="!outline-none !border-none mr-[5px]" checked={useCustomShortCode()} /> 
              </div>
              <Show when={useCustomShortCode()}>
                <input type="text" class="input" id="custom_short_code" name="custom_short_code" placeholder="Custom short code"></input>
              </Show>
            </Expandable>
            <div class="final w-full flex flex-row justify-end mt-3">
              <button class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-black">Shorten</button>
            </div>
          </div>
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

const Expandable: Component<{ title: string, children: any }> = (props) => {
  const [expand, setExpand] = createSignal(false);

  return (
    <div class="w-full">
      <div class="w-full mt-3 cursor-pointer flex flex-row justify-between items-center" onClick={() => {
        setExpand(!expand());
      }}>
        <span class="text-lg">More options</span>
        <Show when={expand()} fallback={<ChevronDown/>}>
          <ChevronUp/>
        </Show>
      </div>
      <Show when={expand()}>
        {props.children}
      </Show>
    </div>
  )
}

export default Home;