import { ButtonInteraction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import ensureDependencies from "./Util/ensureDependencies";

export {};
declare global {
	interface String {
		withPlaceholders(placeholders: any): string;
	}
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

// @ts-ignore
String.prototype.withPlaceholders = function (placeholders = {}) {
	let str = this;
	for (let key in placeholders) str = str.replace(new RegExp(`\{${key}\}`, "gi"), placeholders[key]);
	return str;
};

export type ComponentInteraction = ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction;

let client;
const init = async () => {
	try {
		await ensureDependencies();
	} catch (err) {
		console.log('[ERROR] Dependencies failed to install automatically. Please install them manually by running "npm install".');
		process.exit(1);
	}

	const { default: Client }: any = await import("./Classes/Client");
	const { default: Logger }: any = await import("./Classes/Logger");
	const { default: ensureNodeVersion }: any = await import("./Util/ensureNodeVersion");
	const { default: loadYamlFiles }: any = await import("./Util/loadYamlFiles");
	const {
		default: { validateConfig, validateLang },
	}: any = await import("./Util/validateConfigs");

	Logger.startup("Starting the bot...");

	ensureNodeVersion();
	const [unvalidatedConfig, unvalidatedLang] = loadYamlFiles();
	const config = validateConfig(unvalidatedConfig);
	const lang = validateLang(unvalidatedLang);

	client = new Client(config, lang);
};
init();
