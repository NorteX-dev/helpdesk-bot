import { Event, Name } from "@nortex/handler";
import { InteractionType } from "discord.js";
import Logger from "../Classes/Logger";
@Name("interactionCreate")
export default class extends Event {
	async run(interaction: any): Promise<void> {
		try {
			if ([InteractionType.MessageComponent, InteractionType.ModalSubmit].includes(interaction.type)) {
				this.client.componentHandler.runComponent(interaction);
			} else {
				this.client.commandHandler.runCommand(interaction).catch((err: any) => {
					interaction.reply({ embeds: [this.client.embed.error(`**Error:** ${err.message}`)] });
				});
			}
		} catch (err: any) {
			Logger.error(err);
			interaction.reply({
				embeds: [this.client.embed.error(`**Error:** ${err.message}`)],
			});
		}
	}
}
