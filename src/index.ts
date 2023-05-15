import { ButtonInteraction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import * as yaml from "js-yaml";
import * as fs from "fs";
import configSchema from "./Const/configValidator";
import Client from "./Classes/Client";
import Logger from "./Classes/Logger";

export type ComponentInteraction = ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction;

let client;

const validateConfig = (config: any) => {
	const configValidation = configSchema.safeParse(config);
	if (!configValidation.success) {
		const err = configValidation["error"];
		Logger.error(
			"Validation of config.yml failed.\nPlease resolve the following errors before running the bot:\n",
			err.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message} (${issue.code})`).join("\n")
		);
		process.exit(1);
	}
	return configValidation.data;
};

const init = async () => {
	Logger.startup("Starting the bot...");

	const configData = fs.readFileSync("./config.yml", "utf8");
	const parsedYaml = yaml.load(configData);
	const config = validateConfig(parsedYaml);

	client = new Client(config);
};
init();
