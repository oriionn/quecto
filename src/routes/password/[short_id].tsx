import {Component} from "solid-js";
import {createAsync, redirect, useParams} from "@solidjs/router";
import Toaster from "~/components/Toaster";
import toast from "solid-toast";
import {config} from "~/routes";
import {MetaProvider, Title} from "@solidjs/meta";
import {Config} from "~/models/config";
import Meta from "~/components/Meta";

export enum UnshortenErrorType {
  SHORTCODE_NOT_FOUND = "Short code not found",
  INVALID_PASSWORD = "Invalid password"
}

export const route = {
  preload: () => config(),
}

const Password: Component = () => {
  const short_id = useParams().short_id;
  const configData = createAsync<Config>((): Promise<Config> => config());

  return (
    <main class="min-h-screen min-w-screen bg-background text-white font-noto flex justify-center items-center">
      <Meta config={configData()} title="Password protected link" />
      <div class="card">
        <h1 class="text-2xl font-bold">Password protected link</h1>
        <input type="password" name="password" id="password" class="input w-full mt-2" placeholder="Password" required />
        <button class="bg-button hover:bg-button-hover px-4 py-2 border-none outline-none rounded-lg text-button-text mt-4" onClick={async () => {
          const password = (document.getElementById("password") as HTMLInputElement).value;
          let data = await submitPassword(short_id, password);
          if (!data) return toast.error("An error has occurred. Please try again.");

          if (data.status !== 200) switch (data.message) {
              case UnshortenErrorType.SHORTCODE_NOT_FOUND:
                return window.location.href = "/?not_found=true";
              case UnshortenErrorType.INVALID_PASSWORD:
                return toast.error("Your password is invalid");
              default:
                return toast.error("An error has occurred. Please try again.");
            }

          window.location.href = data.data.link;
        }}>Submit</button>
      </div>

      <Toaster />
    </main>
  );
}

export async function submitPassword(short_code: string, password: string | undefined, usePassword: boolean = true) {
  "use server";
  if (!password && usePassword) return {
    status: 400,
    message: "Password is required"
  }

  const core = await import("~/core/unshorten");
  return await (await core.unshorten({
    short_code,
    password
  })).json();
}

export default Password;