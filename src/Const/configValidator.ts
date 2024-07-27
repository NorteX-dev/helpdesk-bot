import { z } from "zod";

const question = z.object({
	question: z.string(),
	response: z.object({
		title: z.string(),
		color: z.string().optional(),
		description: z.string(),
		image: z.object({ enabled: z.boolean(), url: z.string().optional() }).default({ enabled: false }),
		thumbnail: z.object({ enabled: z.boolean(), url: z.string().optional() }).default({ enabled: false }),
	}),
});

const configSchema = z.object({
	token: z.string(),
	status: z.string().optional(),
	owners: z.array(z.string()),
	log_channel_id: z.string().optional(),
	embed_content: z.object({
		title: z.string(),
		color: z
			.string()
			.refine((color) => !isNaN(parseInt(color, 16)), { message: "The color property is not a valid hex color. It cannot contain a #." }),
		image: z.object({ enabled: z.boolean(), url: z.string().optional() }).default({ enabled: false }),
		thumbnail: z.object({ enabled: z.boolean(), url: z.string().optional() }).default({ enabled: false }),
	}),
	questions: z.array(question).min(1).max(25).default([]),
});

export default configSchema;
export type Config = z.infer<typeof configSchema>;
export type ConfigQuestion = z.infer<typeof question>;
