const Discord = require('discord.js');

module.exports = {
    name: 'suggest',
    description: 'Creates a suggestion where people can react with yes or no',
    guildOnly: true,
    async execute(message, args) {
        let title = '';
        message.author.send('Write a title for your suggestion.').then(() => {
            message.channel
                .awaitMessages({
                    maxMatches: 1,
                    time: 30000,
                    errors: ['time'],
                })
                .then(collected => {
                    title = collected.content
                        .join(',')
                        .replace(/,/g, ' ')
                        .split();
                    console.log(title);
                })
                .catch(collected => {
                    message.channel.send('Too late');
                });
        });

        const userAvatar = (
            await message.client.fetchUser(message.member.user.id)
        ).avatarURL;
        const suggestEmbed = new Discord.RichEmbed()
            .setColor('#0EE34A')
            .setTitle('New Suggestion!')
            .setDescription(finalSuggestion)
            .setThumbnail('https://i.imgur.com/davX7Gc.png')
            .setFooter(`Suggested by ${message.member.user.tag}`, userAvatar);
    },
};
