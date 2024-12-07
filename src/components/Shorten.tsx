import {Component, createSignal, Show} from "solid-js";
import {ChevronDown, ChevronUp, Eye, EyeOff} from "lucide-solid";
import Expandable from "~/components/Expandable";

const Shorten: Component = () => {
  const [passwordProtection, setPasswordProtection] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [useCustomShortCode, setUseCustomShortCode] = createSignal(false);
  const [isSelectOpen, setIsSelectOpen] = createSignal(false);
  
  return (
    <div class="card">
      <h1 class="text-2xl font-bold">Shorten a link</h1>
      <input type="text" class="input" id="link" name="link" placeholder="Your link"/>
      <div class="flex flex-row items-center">
        <select
          class="input appearance-none"
          onBlur={() => setIsSelectOpen(false)}
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
        <Show when={isSelectOpen()} fallback={<ChevronDown class="ml-[-35px] mt-2" color="black"/>}>
          <ChevronUp class="ml-[-35px] mt-2" color="black"/>
        </Show>
      </div>
      <Expandable title="More options">
        <div class="flex flex-row justify-between cursor-pointer w-full"
             onClick={() => setPasswordProtection(!passwordProtection())}>
          <label for="password_protection" class="cursor-pointer"
                 onClick={() => setPasswordProtection(!passwordProtection())}>Protect a link with a password ?</label>
          <input type="checkbox" id="password_protection" name="password_protection"
                 class="!outline-none !border-none mr-[5px]" checked={passwordProtection()}/>
        </div>
        <Show when={passwordProtection()}>
          <div class="flex flex-row items-center mb-3">
            <input type={showPassword() ? "text" : "password"} class="input" id="password" name="password"
                   placeholder="Password"></input>
            <Show when={showPassword()} fallback={
              <Eye onClick={() => setShowPassword(true)} color="black" class="ml-[-35px] mt-2 cursor-pointer"/>
            }>
              <EyeOff onClick={() => setShowPassword(false)} color="black" class="ml-[-35px] mt-2 cursor-pointer"/>
            </Show>
          </div>
        </Show>

        <div class="flex flex-row justify-between cursor-pointer w-full"
             onClick={() => setUseCustomShortCode(!useCustomShortCode())}>
          <label for="use_custom_short_code" class="cursor-pointer"
                 onClick={() => setUseCustomShortCode(!useCustomShortCode())}>Use a custom short code ?</label>
          <input type="checkbox" id="use_custom_short_code" name="use_custom_short_code"
                 class="!outline-none !border-none mr-[5px]" checked={useCustomShortCode()}/>
        </div>
        <Show when={useCustomShortCode()}>
          <input type="text" class="input" id="custom_short_code" name="custom_short_code"
                 placeholder="Custom short code"></input>
        </Show>
      </Expandable>
      <div class="final w-full flex flex-row justify-end mt-3">
        <button
          class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-black">Shorten
        </button>
      </div>
    </div>
  )
}

export default Shorten;