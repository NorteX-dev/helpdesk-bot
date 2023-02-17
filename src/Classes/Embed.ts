import { EmbedBuilder } from "discord.js";
import Client from "./Client";

export default class Embed {
	client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	baseEmbed(content?: string) {
		let embed = new EmbedBuilder().setTimestamp();
		if (content) embed.setDescription(content).setColor(this.client.config.embeds.colors.normal);
		if (this.client.config.embeds.footer) embed.setFooter({ text: this.client.config.embeds.footer });
		return embed;
	}

	info(content?: string) {
		return this.baseEmbed(content).setColor(this.client.config.embeds.colors.normal);
	}

	error(content?: string) {
		return this.baseEmbed(content).setColor(this.client.config.embeds.colors.error);
	}

	warn(content?: string) {
		return this.baseEmbed(content).setColor("#be7a22");
	}

	success(content?: string) {
		return this.baseEmbed(content).setColor(this.client.config.embeds.colors.success);
	}
}
