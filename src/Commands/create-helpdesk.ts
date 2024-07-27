import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { CommandError } from "nhandler";

import BaseCommand from "../Classes/BaseCommand";

export default class extends BaseCommand {
	name = "helpdesk";
	description = "Create the help desk.";

	emojis = [
		"<:number_1:1105757774815694898>",
		"<:number_2:1105757776707321898>",
		"<:number_3:1105757780591247432>",
		"<:number_4:1105757783053324349>",
		"<:number_5:1105757784525525052>",
		"<:number_6:1105757787029512242>",
		"<:number_7:1105757788409442324>",
		"<:number_8:1105757789575467139>",
		"<:number_9:1105757792175923291>",
		"<:number_10:1105757793732010037>",
		"<:number_11:1105758076528762951>",
		"<:number_12:1105758080223940639>",
		"<:number_13:1105758082371432458>",
		"<:number_14:1105758085512974446>",
		"<:number_15:1105758088084082718>",
		"<:number_16:1105758089333981195>",
		"<:number_17:1105758092454526976>",
		"<:number_18:1105758093851234304>",
		"<:number_19:1105758095428305037>",
		"<:number_20:1105758097907134464>",
		"<:number_21:1105758099341574204>",
		"<:number_22:1105758101111591032>",
		"<:number_23:1105758103099670531>",
		"<:number_24:1105758105054236693>",
		"<:number_25:1105758134330470481>",
	];

	async run(interaction: ChatInputCommandInteraction): Promise<void> {
		if (!interaction.guild) throw new CommandError("This command can only be used in a server.");
		if (!this.client.config.owners.includes(interaction.user.id)) throw new CommandError("You are not allowed to use this command.");
		if (!this.client.config.questions.length) throw new CommandError("There aren't any questions set up in the bot config.");

		const desc = this.client.config.questions
			.map(({ question }: { question: string }, idx: number) => {
				return `**[${idx + 1}]** ${question}`;
			})
			.join("\n");

		const embed = new EmbedBuilder();
		embed.setAuthor({
			name: this.client.config.embed_content.title,
			iconURL: this.client.user!.displayAvatarURL({ size: 256 }),
		});
		embed.setTimestamp();
		embed.setColor(parseInt(this.client.config.embed_content.color, 16));
		if (this.client.config.embed_content.thumbnail.enabled && this.client.config.embed_content.thumbnail.url)
			embed.setThumbnail(this.client.config.embed_content.thumbnail.url);
		if (this.client.config.embed_content.image.enabled && this.client.config.embed_content.image.url)
			embed.setImage(this.client.config.embed_content.image.url);
		embed.setDescription(desc);
		embed.setFooter({ text: interaction.guild.name });

		let rows = [];
		for (let rowOffset = 0; rowOffset < this.client.config.questions.length; rowOffset += 5) {
			const row = new ActionRowBuilder<ButtonBuilder>();
			const components = [];
			for (let colIdx = 0; colIdx < 5; colIdx++) {
				const idx = rowOffset + colIdx;
				if (this.client.config.questions[idx]) {
					components.push(new ButtonBuilder().setStyle(ButtonStyle.Secondary).setEmoji(this.emojis[idx]).setCustomId(`helpdesk-${idx}`));
				}
			}
			row.addComponents(components);
			rows.push(row);
		}

		await interaction.channel!.send({ embeds: [embed], components: rows });
		interaction.reply({ content: "Help desk created.", ephemeral: true });
	}
}
