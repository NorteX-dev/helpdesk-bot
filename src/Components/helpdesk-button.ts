import dayjs from "dayjs";
import { EmbedBuilder, TextChannel } from "discord.js";
import { AnyComponentInteraction, ComponentError } from "nhandler";

import BaseComponent from "../Classes/BaseComponent";
import { ConfigQuestion } from "../Const/configValidator";

export default class extends BaseComponent {
	customId = "helpdesk";

	async run(interaction: AnyComponentInteraction): Promise<void> {
		if (!interaction.guild) throw new ComponentError("This button can only be used in a server.");

		const idx = parseInt(interaction.customId.split("-")[1]);
		const question = this.client.config.questions[idx];
		if (!question) {
			throw new ComponentError("This question doesn't exist.");
		}
		if (!question.response) {
			throw new ComponentError("This question doesn't have a response set up.");
		}
		this.respond(interaction, question);
		this.log(interaction, idx);
	}

	private respond(interaction: AnyComponentInteraction, question: ConfigQuestion) {
		const embed = new EmbedBuilder();
		embed.setAuthor({
			name: this.client.config.embed_content.title,
			iconURL: this.client.user!.displayAvatarURL({ size: 256 }),
		});
		embed.setTimestamp();
		embed.setColor(parseInt(question.response.color || this.client.config.embed_content.color, 16));
		embed.setFooter({ text: interaction.guild!.name });
		if (question.response.description) embed.setDescription(question.response.description);
		if (question.response.image.enabled && question.response.image.url) embed.setImage(question.response.image.url);
		if (question.response.thumbnail.enabled && question.response.thumbnail.url) embed.setThumbnail(question.response.thumbnail.url);
		interaction.reply({ embeds: [embed], ephemeral: true });
	}

	private log(interaction: AnyComponentInteraction, idx: number) {
		if (!this.client.config.log_channel_id) return;
		const channel = this.client.channels.cache.get(this.client.config.log_channel_id);
		if (!channel || !(channel instanceof TextChannel)) return;
		channel.send({
			content: `**${interaction.user.tag}** (\`${interaction.user.id}\`) used button ${idx + 1} at ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
		});
	}
}
