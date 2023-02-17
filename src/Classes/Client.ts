import { Client as DJSClient, GatewayIntentBits, Partials } from "discord.js";
import { CommandHandler, ComponentHandler, EventHandler } from "@nortex/handler";
import Embed from "./Embed";
import Logger from "./Logger";
import * as path from "path";
import { Config } from "../Const/configValidator";

export let CLIENT_INSTANCE: Client | undefined;

export default class Client extends DJSClient {
	config: Config;
	initDate: number;
	commandHandler!: CommandHandler;
	componentHandler!: ComponentHandler;
	embed!: Embed;

	constructor(config: Config) {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
			partials: [Partials.Channel, Partials.Message],
		});
		CLIENT_INSTANCE = this;
		this.config = config;

		this.initDate = Date.now();

		this.init().then(() => () => {
			Logger.startup("Client initialized.");
		});
	}

	createHandlers() {
		this.commandHandler = this.createInteractionHandler();
		this.componentHandler = this.createComponentHandler();
		this.createEventHandler();
	}

	async init() {
		this.embed = new Embed(this);
		this.run();
	}

	async run() {
		try {
			await super.login(this.config.token);
		} catch (err) {
			Logger.error("Can't login as the bot.", err);
		}
	}

	createInteractionHandler() {
		const handler = new CommandHandler({
			client: this,
			directory: path.join(__dirname, "../Commands"),
		});
		handler.on("load", (inter) => Logger.startup(`Slash command loaded: ${inter.name}`));
		return handler;
	}

	createEventHandler() {
		const handler = new EventHandler({
			client: this,
			directory: path.join(__dirname, "../Events"),
		});
		handler.on("load", (ev) => Logger.startup(`Event loaded: ${ev.name}`));
		return handler;
	}

	createComponentHandler() {
		const handler = new ComponentHandler({
			client: this,
			directory: path.join(__dirname, "../Components"),
		});
		handler.on("load", (com) => Logger.startup(`Component loaded: ${com.customId}`));
		return handler;
	}
}
