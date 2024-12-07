import {Component, createSignal, Show} from "solid-js";
import {ChevronDown, ChevronUp} from "lucide-solid";

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

export default Expandable;