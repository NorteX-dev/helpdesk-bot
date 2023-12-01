import { AnyComponentInteraction, Component, ComponentError } from "nhandler";

import Client from "./Client";

export default abstract class BaseComponent implements Component {
	client!: Client;
	findFn = (event: AnyComponentInteraction) => event.customId.startsWith(this.customId);
	abstract customId: string;

	async error(interaction: AnyComponentInteraction, error: ComponentError): Promise<void> {
		interaction.reply({ content: error.message, ephemeral: true });
		return;
	}

	abstract run(interaction: AnyComponentInteraction, metadata: any): Promise<void>;
}
