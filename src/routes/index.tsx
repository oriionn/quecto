import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-solid";
import { children, Component, createSignal, ParentComponent, Show } from "solid-js";

const Home: Component = () => {
  const [passwordProtection, setPasswordProtection] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [useCustomShortCode, setUseCustomShortCode] = createSignal(false);

  return (
    <main class="min-h-screen min-w-screen bg-background text-white font-noto">
      <div class="p-12 gap-12 grid grid-cols-2 grid-rows-1 w-full h-full">
        <div class="first-col">
          <div class="card">
            <h1 class="text-2xl">Shorten a link</h1>
            <input type="text" class="input" id="link" name="link" placeholder="Your link" />
            <Expandable title="More options">
              <div class="flex flex-row justify-between cursor-pointer w-full" onClick={() => setPasswordProtection(!passwordProtection())}>
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
              <button class="bg-button px-4 py-2 border-none outline-none rounded-lg text-black">Shorten</button>
            </div>
          </div>
        </div>
        <div class="second-col card">second</div>
      </div>
    </main>
  );
}

const Expandable: Component<{ title: string, children: any}> = (props) => {
  const [expand, setExpand] = createSignal(false);

  return (
    <div class="w-full">
      <div class="w-full mt-3 cursor-pointer flex flex-row justify-between items-center" onClick={() => {
        setExpand(!expand());
      }}>
        <span class="text-lg">More options</span>
        <Show when={expand()} fallback={<ChevronDown />}>
          <ChevronUp />
        </Show>
      </div>
      <Show when={expand()}>
        {props.children}
      </Show>
    </div>
  )
}

export default Home;