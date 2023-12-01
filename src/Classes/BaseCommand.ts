import { ChatInputCommandInteraction } from "discord.js";
import { Command, CommandError } from "nhandler";

import Client from "./Client";

export default abstract class BaseCommand implements Command {
	client!: Client;
	abstract name: string;
	abstract description: string;

	async error(interaction: ChatInputCommandInteraction, error: CommandError): Promise<void> {
		interaction.reply({ content: error.message, ephemeral: true });
		return;
	}

	abstract run(interaction: ChatInputCommandInteraction, metadata: any): Promise<void>;
}
