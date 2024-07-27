import { ActivityType } from "discord.js";
import { Event } from "nhandler";

import Client from "../Classes/Client";
import Logger from "../Classes/Logger";

export default class implements Event {
	client!: Client;
	name = "ready";

	async run() {
		let message = `The bot is ready in ${Date.now() - this.client.initDate}ms as ${this.client.user?.tag}.`;
		Logger.startup(message);

		if (this.client.config.status) {
			this.client.user!.setPresence({
				status: "idle",
				activities: [{ name: this.client.config.status, type: ActivityType.Watching }],
			});
		}

		Client.commandHandler.updateApplicationCommands();
		Logger.startup("Updated application commands.");
	}
}
