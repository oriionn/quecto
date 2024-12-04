import presetWebFonts from "@unocss/preset-web-fonts";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import { defineConfig, presetUno } from "unocss";

export default defineConfig({
    transformers: [
      transformerVariantGroup(),
    ],
    theme: {
        colors: {
          background: "#191E24",
          button: "#d2e0f7"
        }
    },
    shortcuts: {
        "card": "bg-white/10 backdrop-blur-lg rounded-xl shadow-lg text-white p-4",
        "input": "text-black rounded-lg w-full p-2 outline-none mt-2 text-lg"
    },
    presets: [
        presetUno(),
        presetWebFonts({
          provider: "google",
          fonts: {
            noto: 'Noto Sans',
          }
        })
      ]
});