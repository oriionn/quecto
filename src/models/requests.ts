import {z} from "zod";

export const ShortenRequest = z.object({
	link: z.string(),
	password: z.string().nullable().optional(),
	expiration: z.number(),
	custom_sc: z.string().nullable().optional()
})

export type ShortenRequest = z.infer<typeof ShortenRequest>

export const DeleteRequest = z.object({
	token: z.string(),
	short_code: z.string()
});

export type DeleteRequest = z.infer<typeof DeleteRequest>