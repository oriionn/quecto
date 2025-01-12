import {Component, createSignal, For, Setter, Show} from "solid-js";
import {ChevronDown, ChevronUp, Copy, CopyCheck, Eye, EyeOff} from "lucide-solid";
import Expandable from "~/components/Expandable";
import toast from "solid-toast";
import {UserStorage} from "~/models/userStorage";
import {SetStoreFunction} from "solid-js/store";
import {Config} from "~/models/config";

enum ResponseMessage {
  INVALID_LINK = "Invalid Link",
  SHORT_CODE_USED = "Short code already used",
  SERVER_ERROR = "An error has occurred on the server. Please try again."
}

const Shorten: Component<{ store: UserStorage, setStore: SetStoreFunction<UserStorage>, config: Config | undefined }> = (props) => {
  const [shortened, setShortened] = createSignal(false);
  const [copied, setCopied] = createSignal(false);
  const [resultShortcode, setResultShortcode] = createSignal<string | undefined>();

  if (!props.config) return <div class="card flex justify-center items-center">Loading...</div>;

  return (
    <div class="card">
      <Show when={shortened()} fallback={
        <ShortenForm setShortened={setShortened} setResultShortcode={setResultShortcode} store={props.store} setStore={props.setStore} config={props.config} />
      }>
        <div>
          <h1 class="text-2xl font-bold">Link shortened!</h1>
          <div class="flex flex-row items-center">
            <input type="text" class="input cursor-not-allowed !bg-white" id="shortened-link" name="shortened-link"
                   value={`${props.config?.ssl ? "https":"http"}://${props.config.domain}/${resultShortcode() ? resultShortcode():""}`} disabled/>
            <Show when={!copied()} fallback={<CopyCheck class="ml-[-35px] mt-2" color="black"/>}>
              <Copy class="ml-[-35px] mt-2 cursor-pointer" color="black" onClick={
                () => {
                  window.navigator.clipboard.writeText(`${props.config?.ssl ? "https":"http"}://${props.config?.domain}/${resultShortcode() ? resultShortcode():""}`).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  })
                }
              } />
            </Show>
          </div>
          <div class="w-full flex flex-row justify-end mt-3">
            <button
              class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-black"
              onClick={() => { setShortened(false); setResultShortcode(undefined); setCopied(false); }}
            >Ok
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

const ShortenForm: Component<{ setShortened: Setter<boolean>, setResultShortcode: Setter<string | undefined>, store: UserStorage, setStore: SetStoreFunction<UserStorage>, config: Config | undefined }> = (props) => {
  const [passwordProtection, setPasswordProtection] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [useCustomShortCode, setUseCustomShortCode] = createSignal(false);
  const [isSelectOpen, setIsSelectOpen] = createSignal(false);

  let link: HTMLInputElement | undefined;
  let expiration: HTMLInputElement | undefined;
  let password: HTMLInputElement | undefined;
  let customShortCode: HTMLSelectElement | undefined;

  const handleShorten = async () => {
    if (link && !link.value) return toast.error("Please provide a link to shorten");
    if (expiration && !expiration.value) return toast.error("Please provide an expiration time");

    let data = await shortenClick(
        (link ? link.value : undefined),
        parseInt((expiration ? expiration.value.toString() : undefined) as string),
        (password ? password.value : undefined),
        (customShortCode ? customShortCode.value : undefined)
    );

    if (!data) return toast.error("An error has occurred. Please try again.");
    if (data.status !== 200) {
      switch (data.message) {
        case ResponseMessage.INVALID_LINK:
          return toast.error("Your link is invalid.");
        case ResponseMessage.SHORT_CODE_USED:
          return toast.error("Your custom short code is already used !");
        case ResponseMessage.SERVER_ERROR:
          return toast.error("An error has occurred on the server. Please try again.");
        default:
          return toast.error("An error has occurred. Please try again.");
      }
    }

    props.setShortened(true);
    props.setResultShortcode(data.data.short_code);
    let history = [...props.store.history, {
      short_code: data.data.short_code,
      link: data.data.link,
      delete_token: data.data.delete_token,
      expiration: data.data.expiration,
      created_at: Date.now()
    }];
    localStorage.setItem("quecto", JSON.stringify({...props.store, history}));
    props.setStore({...props.store, history});
    toast.success("Link has been successfully shortened.");
  }

  return (
    <div>
      <h1 class="text-2xl font-bold">Shorten a link</h1>
      <input type="text" class="input" id="link" name="link" placeholder="Your link" ref={link} />
      <div class="flex flex-row items-center">
        <select
            class="input appearance-none"
            onBlur={() => setIsSelectOpen(false)}
            onClick={() => setIsSelectOpen(!isSelectOpen())}
            name="expiration"
            id="expiration"
            ref={expiration}
        >
          <option value="" selected disabled hidden>Expiration time</option>
          <For each={props.config?.expirations}>
            {(expiration) => (
                <option value={expiration.minutes}>{expiration.name}</option>
            )}
          </For>
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
                 class="!outline-none !border-none mr-[5px]" checked={passwordProtection()} />
        </div>
        <Show when={passwordProtection()}>
          <div class="flex flex-row items-center mb-3">
            <input type={showPassword() ? "text" : "password"} class="input" id="password" name="password"
                   placeholder="Password" ref={password}></input>
            <Show when={showPassword()} fallback={
              <Eye onClick={() => setShowPassword(true)} color="black" class="ml-[-35px] mt-2 cursor-pointer"/>
            }>
              <EyeOff onClick={() => setShowPassword(false)} color="black" class="ml-[-35px] mt-2 cursor-pointer"/>
            </Show>
          </div>
        </Show>

        <Show when={props.config?.authorize_custom_shortcode}>
          <div class="flex flex-row justify-between cursor-pointer w-full"
               onClick={() => setUseCustomShortCode(!useCustomShortCode())}>
            <label for="use_custom_short_code" class="cursor-pointer"
                   onClick={() => setUseCustomShortCode(!useCustomShortCode())}>Use a custom short code ?</label>
            <input type="checkbox" id="use_custom_short_code" name="use_custom_short_code"
                   class="!outline-none !border-none mr-[5px]" checked={useCustomShortCode()}/>
          </div>
          <Show when={useCustomShortCode()}>
            <input type="text" className="input" id="custom_short_code" name="custom_short_code"
                   placeholder="Custom short code" ref={customShortCode}></input>
          </Show>
        </Show>
      </Expandable>
      <div class="final w-full flex flex-row justify-end mt-3">
        <button
            class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-black"
            onClick={handleShorten}
        >Shorten
        </button>
      </div>
    </div>
  )
}

async function shortenClick(link?: string, expiration?: number, password?: string, customShortCode?: string) {
  "use server";
  const {shorten} = await import("~/core/shorten");

  if (!link || (expiration !== 0 && !expiration)) return {
    status: 400,
    message: "Invalid Data"
  }

  if (!link.startsWith("https://") && !link.startsWith("http://")) link = "https://" + link;

  return (await shorten({
    link,
    expiration,
    password,
    custom_sc: customShortCode
  })).json();
}

export default Shorten;