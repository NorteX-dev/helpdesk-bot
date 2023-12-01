import { Interaction } from "discord.js";
import { Event, isAutocompleteInteraction, isCommandInteraction, isComponentInteraction } from "nhandler";

import Client from "../Classes/Client";

export default class implements Event {
	client!: Client;
	name = "interactionCreate";

	async run(interaction: Interaction): Promise<void> {
		if (isComponentInteraction(interaction)) {
			Client.componentHandler.runComponent(interaction);
		} else if (isCommandInteraction(interaction)) {
			Client.commandHandler.runCommand(interaction);
		} else if (isAutocompleteInteraction(interaction)) {
			Client.commandHandler.runAutocomplete(interaction);
		}
	}
}
