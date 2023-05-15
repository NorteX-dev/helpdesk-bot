import { Client as DJSClient, GatewayIntentBits, Partials } from "discord.js";
import { CommandHandler, ComponentHandler, EventHandler } from "@nortex/handler";
import Logger from "./Logger";
import * as path from "path";
import { Config } from "../Const/configValidator";

export let CLIENT_INSTANCE: Client | undefined;

export default class Client extends DJSClient {
	config: Config;
	initDate: number;
	commandHandler!: CommandHandler;
	componentHandler!: ComponentHandler;

	constructor(config: Config) {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
			partials: [Partials.Channel, Partials.Message],
		});
		CLIENT_INSTANCE = this;
		this.config = config;

		this.initDate = Date.now();

		Logger.startup("Client initialized.");
		this.createHandlers();
		this.run();
	}

	createHandlers() {
		this.commandHandler = this.createInteractionHandler();
		this.componentHandler = this.createComponentHandler();
		this.createEventHandler();
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
		handler.on("load", (int) => Logger.startup(`Slash command loaded: ${int.name}`));
		return handler;
	}

	createEventHandler() {
		const handler = new EventHandler({
			client: this,
			directory: path.join(__dirname, "../Events"),
		});
		handler.on("load", (evt) => Logger.startup(`Event loaded: ${evt.name}`));
		return handler;
	}

	createComponentHandler() {
		const handler = new ComponentHandler({
			client: this,
			directory: path.join(__dirname, "../Components"),
		});
		handler.on("load", (cmp) => Logger.startup(`Component loaded: ${cmp.customId}`));
		return handler;
	}
}
