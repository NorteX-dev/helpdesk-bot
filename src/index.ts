import * as fs from "fs";
import * as yaml from "js-yaml";

import Client from "./Classes/Client";
import Logger from "./Classes/Logger";
import configSchema from "./Const/configValidator";

const validateConfig = (config: any) => {
	const configValidation = configSchema.safeParse(config);
	if (!configValidation.success) {
		Logger.error(
			"Validation of config.yml failed.\nPlease resolve the following errors before running the bot:\n",
			configValidation.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message} (${issue.code})`).join("\n"),
		);
		process.exit(1);
	}
	return configValidation.data;
};

(async () => {
	Logger.startup("Starting the bot...");

	const configData = fs.readFileSync("./config.yml", "utf8");
	const parsedYaml = yaml.load(configData);
	const config = validateConfig(parsedYaml);

	new Client(config);
})();
