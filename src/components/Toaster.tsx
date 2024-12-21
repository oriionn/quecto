import {Component} from "solid-js";
import {Toaster as SolidToaster} from "solid-toast";

const Toaster: Component = () => (
  <SolidToaster
    position="bottom-center"
    toastOptions={{
      style: {
        background: '#1f2937',
        color: '#f3f4f6'
      },
      iconTheme: {
        primary: '#38bdf8',
        secondary: '#1f2937'
      },
      duration: 2500
    }}
  />
)

export default Toaster;