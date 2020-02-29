const Discord = require('discord.js');

module.exports = {
    name: 'suggest',
    description: 'Creates a suggestion where people can react with yes or no',
    guildOnly: true,
    async execute(message) {
        let title = '';
        let description = '';
        let filter = m => m.author.id === message.author.id;
        let isTitleMissed = false;
        let isDescriptionMissed = false;
        let hasDMsOff = false;

        await message.author.createDM();
        try {
            await message.author.send('Enter a title for your suggestion');
        } catch (e) {
            hasDMsOff = true;
            await message.channel.send(
                `Please enable your dm's to create a suggestion.`,
            );
        }
        if (!hasDMsOff) {
            await message.channel.send(
                `Check your dm's to create your suggestion.`,
            );
            try {
                let msg = await message.author.dmChannel.awaitMessages(filter, {
                    maxMatches: 1,
                    time: 30000,
                    errors: ['time'],
                });
                title = msg.first().content;
            } catch (e) {
                isTitleMissed = true;
                message.author.send('You did not enter a title on time.');
            }

            if (!isTitleMissed) {
                await message.author.send(
                    'Enter a description for your suggestion',
                );
                try {
                    let msg = await message.author.dmChannel.awaitMessages(
                        filter,
                        {
                            maxMatches: 1,
                            time: 120000,
                            errors: ['time'],
                        },
                    );
                    description = msg.first().content;
                } catch (e) {
                    isDescriptionMissed = true;
                    message.author.send(
                        'You did not enter a description on time.',
                    );
                }
            }

            if (!isTitleMissed && !isDescriptionMissed) {
                const userAvatar = (
                    await message.client.fetchUser(message.author.id)
                ).avatarURL;
                const suggestionEmbed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(title)
                    .setDescription(description)
                    .setFooter(
                        `Suggested by ${message.author.tag}`,
                        userAvatar,
                    );
                await message.author.send(
                    `Success! We'll send this in <#681185610181902385> where people can vote on your suggestion.`,
                );
                await message.author.send(suggestionEmbed);

                await message.guild.channels
                    .find(c => c.id === '681185610181902385')
                    .send(suggestionEmbed)
                    .then(embed => {
                        embed
                            .react('680835679592251456')
                            .then(() => embed.react('680835693013893136'));
                    });
            }
        }
    },
};
