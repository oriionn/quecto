import {Component, Show} from "solid-js";
import {Config} from "~/models/config";
import {Meta, MetaProvider, Title} from "@solidjs/meta";

const MetaC: Component<{ config: Config | undefined, title: string }> = (props) => {
    console.log(props.config?.instance);

    return (
        <MetaProvider>
            <Show when={props.config}>
                <Title>{props.config?.instance} - {props.title}</Title>
            </Show>

            <Meta property="og:title" content={props.title} />
            <Meta property="og:type" content="website" />
            <Meta property="og:description" content="A simple link shortener" />
            <Meta name="description" content="A simple link shortener" />

            <Meta name="twitter:card" content="summary" />
            <Meta name="twitter:title" content={props.title} />
            <Meta name="twitter:description" content="A simple link shortener" />
        </MetaProvider>
    )
}


export default MetaC as Meta;