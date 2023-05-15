import { z } from "zod";

const question = z.object({
	question: z.string(),
	response: z.string(),
});

const configSchema = z.object({
	token: z.string(),
	status: z.string().optional(),
	owners: z.array(z.string()),
	log_channel_id: z.string().optional(),
	embed_content: z.object({
		title: z.string(),
		color: z.string().refine((color) => !isNaN(parseInt(color, 16)), { message: "The color property is not a valid hex color. It cannot contain a #." }),
		thumbnail: z
			.object({
				enabled: z.boolean(),
				url: z.string().optional(),
			})
			.default({
				enabled: false,
			}),
	}),
	questions: z.array(question).max(10).default([]),
});

export default configSchema;
export type Config = z.infer<typeof configSchema>;
export type ConfigQuestion = z.infer<typeof question>;
