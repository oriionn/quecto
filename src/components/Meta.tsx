import {Component} from "solid-js";
import {Config} from "~/models/config";
import {Meta, MetaProvider, Title} from "@solidjs/meta";

const MetaC: Component<{ config: Config | undefined, title: string }> = (props) => {
    return (
        <MetaProvider>
            <Title>{props.config?.instance} - {props.title}</Title>
            <Meta property="og:title" content={`${props.config?.instance} - ${props.title}`} />
            <Meta property="og:type" content="website" />
            <Meta property="og:url" content={window.location.href} />
            <Meta property="og:description" content="A simple link shortener" />
            <Meta property="og:site_name" content={props.config?.instance} />
            <Meta name="description" content="A simple link shortener" />

            <Meta name="twitter:card" content="summary" />
            <Meta name="twitter:title" content={`${props.config?.instance} - ${props.title}`} />
            <Meta name="twitter:description" content="A simple link shortener" />
        </MetaProvider>
    )
}

export default MetaC as Meta;