import {Component, createSignal, Show} from "solid-js";
import toast from "solid-toast";
import {submitPassword, UnshortenErrorType} from "~/routes/password/[short_id]";
import {Copy, CopyCheck, Eye, EyeOff} from "lucide-solid";
import {Config} from "~/models/config";

const Unshorten: Component<{ config: Config | undefined }> = (props) => {
  if (!props.config) return <div class="card flex justify-center items-center">Loading...</div>;

  const [page, setPage] = createSignal(1);
  const [shortenedLink, setShortenedLink] = createSignal("");
  const [originalLink, setOriginalLink] = createSignal("");
  const [copied, setCopied] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  let link: HTMLInputElement | undefined;
  let password: HTMLInputElement | undefined;

  return (
    <div class="card">
      <Show when={page() === 1}>
        <h1 class="text-2xl font-bold">Unshorten a link</h1>
        <input type="text" className="input" id="shortened-link" name="shortened-link" placeholder="Your link"
               ref={link}/>
        <div class="final w-full flex flex-row justify-end mt-3">
          <button
            class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-black" onClick={async () => {
              if (!link?.value) return toast.error("Please provide a link");

              // Verify if the link is a valid shortened link
              let linkValue = link.value;
              if (!linkValue.startsWith(`${props.config?.ssl ? "https":"http"}://${props.config?.domain}/`)) return toast.error("Invalid shortened link");
              let short_code = linkValue.split(`${props.config?.ssl ? "https":"http"}://${props.config?.domain}/`)[1];


              // Check if the link is password protected
              let hasPassword = await isPasswordProtected(short_code);
              if (hasPassword.status !== 200) return toast.error(hasPassword.message);

              setShortenedLink(linkValue);
              if (hasPassword.data) return setPage(2);

              // Unshorten the link
              let data = await submitPassword(short_code, undefined, false);
              if (!data) return toast.error("An error has occurred. Please try again.");

              if (data.status !== 200) switch (data.message) {
                case UnshortenErrorType.SHORTCODE_NOT_FOUND:
                  return toast.error("Short code not found");
                default:
                  console.log(data)
                  return toast.error("An error has occurred. Please try again.");
              }

              setOriginalLink(data.data.link);
              setPage(3)
          }}>Unshorten
          </button>
        </div>
      </Show>
      <Show when={page() === 2}>
        <h1 class="text-2xl font-bold">This is a password protected link !</h1>
        <div class="flex flex-row items-center mb-3">
          <input type={showPassword() ? "text" : "password"} class="input" id="password" name="password"
                 placeholder="Password" ref={password}></input>
          <Show when={showPassword()} fallback={
            <Eye onClick={() => setShowPassword(true)} color="black" class="ml-[-35px] mt-2 cursor-pointer"/>
          }>
            <EyeOff onClick={() => setShowPassword(false)} color="black" class="ml-[-35px] mt-2 cursor-pointer"/>
          </Show>
        </div>
        <div class="final w-full flex flex-row justify-end mt-3">
          <button
            class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-black"
            onClick={async () => {
              if (!password?.value) return toast.error("Please provide a password");
              let passwordValue = password.value;

              // Check if the password is correct
              let short_code = shortenedLink().split(`${props.config?.ssl ? "https":"http"}://${props.config?.domain}/`)[1];
              let data = await submitPassword(short_code, passwordValue);
              if (!data) return toast.error("An error has occurred. Please try again.");

              if (data.status !== 200) switch (data.message) {
                case UnshortenErrorType.SHORTCODE_NOT_FOUND:
                  return toast.error("Short code not found");
                case UnshortenErrorType.INVALID_PASSWORD:
                  return toast.error("Your password is invalid");
                default:
                  return toast.error("An error has occurred. Please try again.");
              }

              setOriginalLink(data.data.link);
              setPage(3)
          }}>Unlock
          </button>
        </div>
      </Show>
      <Show when={page() === 3}>
        <h1 class="text-2xl font-bold">Link unshortened !</h1>
        <div className="flex flex-row items-center">
          <input type="text" className="input cursor-not-allowed !bg-white" id="shortened-link" name="shortened-link"
                 value={originalLink()} disabled/>
          <Show when={!copied()} fallback={<CopyCheck class="ml-[-35px] mt-2" color="black"/>}>
            <Copy class="ml-[-35px] mt-2 cursor-pointer" color="black" onClick={
              () => {
                window.navigator.clipboard.writeText(originalLink()).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                })
              }
            }/>
          </Show>
        </div>
        <div className="final w-full flex flex-row justify-end mt-3">
          <button
            class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-black"
            onClick={() => {
              setPage(1)
            }}>Ok
          </button>
        </div>
      </Show>
    </div>
  )
}

async function isPasswordProtected(code: string) {
  "use server";
  const {hasPassword} = await import("~/core/hasPassword");
  let res = await hasPassword({short_code: code});
  let data = await res.json();
  if (res.status !== 200) return {
    status: res.status,
    message: data.message ? data.message : "An error occurred while checking if the link is password protected"
  }
  return data;
}

export default Unshorten;