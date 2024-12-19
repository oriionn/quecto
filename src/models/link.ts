export interface Link {
    link: string;
    short_code: string;
    expiration: number;
    password?: string;
    delete_token: string;
    created_at?: number | undefined;
}