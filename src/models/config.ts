export interface Config {
    instance: string;
    domain: string;
    ssl: boolean;
    authorize_custom_shortcode: boolean;
    expirations: Expiration[];
}

export interface Expiration {
    name: string;
    minutes: number;
}