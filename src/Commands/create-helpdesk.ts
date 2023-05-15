import { Category, Command, Description, Name } from "@nortex/handler";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

@Name("helpdesk")
@Description("Create the help desk.")
@Category("Helpdesk")
export default class extends Command {
	emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

	async run(interaction: ChatInputCommandInteraction): Promise<void> {
		if (!interaction.guild) {
			interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
			return;
		}

		if (!this.client.config.owners.includes(interaction.user.id)) {
			interaction.reply({ content: "You are not allowed to use this command.", ephemeral: true });
			return;
		}

		if (!this.client.config.questions.length) {
			interaction.reply({ content: "There aren't any questions set up in the bot config.", ephemeral: true });
			return;
		}

		const desc = this.client.config.questions
			.map(({ question }: { question: string }, idx: number) => {
				return `**[${this.emojis[idx]}]** ${question}`;
			})
			.join("\n");

		const embed = new EmbedBuilder();
		embed.setAuthor({
			name: this.client.config.embed_content.title,
			iconURL: this.client.user.displayAvatarURL(),
		});
		embed.setTimestamp();
		embed.setColor(parseInt(this.client.config.embed_content.color, 16));
		if (this.client.config.embed_content.thumbnail.enabled) {
			embed.setThumbnail(this.client.config.embed_content.thumbnail.url);
		}
		embed.setDescription(desc);
		embed.setFooter({ text: interaction.guild.name });
		// embed.addFields(
		// 	this.client.config.questions.map(({ question }: { question: string }, idx: number) => {
		// 		return { name: `**${this.emojis[idx]}:**`, value: `${question}`, inline: true };
		// 	})
		// );

		let rows = [];
		for (let rowOffset = 0; rowOffset < this.client.config.questions.length; rowOffset += 5) {
			const row = new ActionRowBuilder<ButtonBuilder>();
			const components = [];
			for (let buttonIdx = 0; buttonIdx < 5; buttonIdx++) {
				if (this.client.config.questions[rowOffset + buttonIdx]) {
					components.push(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Secondary)
							.setEmoji(this.emojis[rowOffset + buttonIdx])
							.setCustomId(`helpdesk-${rowOffset + buttonIdx}`)
					);
				}
			}
			row.addComponents(components);
			rows.push(row);
		}

		await interaction.channel!.send({ embeds: [embed], components: rows });
		interaction.reply({ content: "Help desk created.", ephemeral: true });
	}
}
