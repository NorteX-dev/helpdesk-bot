import { Component, CustomID, QueryingMode } from "@nortex/handler";
import { ComponentInteraction } from "../index";
import { EmbedBuilder } from "discord.js";
import { ConfigQuestion } from "../Const/configValidator";

@CustomID("helpdesk", QueryingMode.StartsWith)
export default class extends Component {
	async run(interaction: ComponentInteraction): Promise<void> {
		if (!interaction.guild) {
			interaction.reply({ content: "This button can only be used in a server.", ephemeral: true });
			return;
		}

		const idx = parseInt(interaction.customId.split("-")[1]);
		const question = this.client.config.questions[idx];
		if (!question) {
			interaction.reply({ content: "This question doesn't exist.", ephemeral: true });
			return;
		}
		if (!question.response) {
			interaction.reply({ content: "This question doesn't have a response set up.", ephemeral: true });
			return;
		}
		this.respond(interaction, question);
		this.log(interaction);
	}

	private respond(interaction: ComponentInteraction, question: ConfigQuestion) {
		const embed = new EmbedBuilder();
		embed.setAuthor({
			name: this.client.config.embed_content.title,
			iconURL: this.client.user.displayAvatarURL({ size: "2048", dynamic: false, format: "png" }),
		});
		embed.setTimestamp();
		embed.setColor(parseInt(this.client.config.embed_content.color, 16));
		embed.setFooter({ text: interaction.guild!.name });
		embed.setDescription(question.response);
		interaction.reply({ embeds: [embed], ephemeral: true });
	}

	private log(interaction: ComponentInteraction) {
		const channel = this.client.channels.cache.get(this.client.config.log_channel_id);
		if (!channel) return;
		channel.send({
			content: `**${interaction.user.tag}** (${interaction.user.id}) used \`${interaction.customId}\`\nTimestamp: ${new Date()}`,
		});
	}
}
