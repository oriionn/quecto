import {z} from "zod";

export interface Link {
    link: string;
    short_code: string;
    expiration: number;
    password?: string;
    delete_token: string;
    created_at?: number | undefined;
}

const zodLink = z.object({
    link: z.string(),
    short_code: z.string(),
    expiration: z.number(),
    password: z.string().nullable().optional(),
    delete_token: z.string(),
    created_at: z.number().nullable().optional()
});

export const ZLink = zodLink;
export type ZLink = z.infer<typeof zodLink>