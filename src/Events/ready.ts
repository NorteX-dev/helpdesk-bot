import { Event, Name, Once } from "@nortex/handler";
import { ActivityType } from "discord.js";
import Logger from "../Classes/Logger";

@Name("ready")
@Once
export default class extends Event {
	async run() {
		let message = `The bot is ready in ${Date.now() - this.client.initDate}ms as ${this.client.user?.tag}.`;
		Logger.startup(message);

		if (this.client.config.status) {
			this.client.user.setPresence({
				status: "idle",
				activities: [
					{
						name: this.client.config.status,
						type: ActivityType.Watching,
					},
				],
			});
		}

		this.updateCommands();
	}

	async updateCommands() {
		this.client.commandHandler
			.updateInteractions(true)
			.then(() => {
				Logger.startup("Slash commands updated.");
			})
			.catch((err: any) => {
				Logger.error("Slash commands failed to update:");
				Logger.error(err);
			});
	}
}
