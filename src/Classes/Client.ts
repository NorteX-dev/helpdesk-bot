import * as path from "path";
import { Client as DJSClient, GatewayIntentBits, Partials } from "discord.js";
import { CommandHandler, ComponentHandler, createCommands, createComponents, createEvents, EventHandler } from "nhandler";

import { Config } from "../Const/configValidator";
import Logger from "./Logger";

export let CLIENT_INSTANCE: Client | undefined;

export default class Client extends DJSClient {
	config: Config;
	initDate: number;
	public static commandHandler: CommandHandler;
	public static componentHandler: ComponentHandler;
	public static eventHandler: EventHandler;

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
		Client.commandHandler = this.createCommandHandler();
		Client.componentHandler = this.createComponentHandler();
		Client.eventHandler = this.createEventHandler();
	}

	async run() {
		try {
			await super.login(this.config.token);
		} catch (err) {
			Logger.error("Can't login as the bot.", err);
		}
	}

	createCommandHandler() {
		Logger.startup("Loading commands...");
		return createCommands<Client>({ client: this }).registerFromDir(path.join(__dirname, "../Commands"));
	}

	createEventHandler() {
		Logger.startup("Loading events...");
		return createEvents({ client: this }).registerFromDir(path.join(__dirname, "../Events"));
	}

	createComponentHandler() {
		Logger.startup("Loading components...");
		return createComponents({ client: this }).registerFromDir(path.join(__dirname, "../Components"));
	}
}
