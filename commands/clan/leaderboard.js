const Discord = require('discord.js');
const fetch = require('node-fetch');
const { prefix } = require('../../config');

module.exports = {
    name: 'leaderboard',
    description: 'Shows the fanix top 100 leaderboard',
    guildOnly: true,
    async execute(message, args) {
        if (args.length) {
            return message.channel.send(
                `Use ${prefix} leaderboard to get the Top 100 Leaderboard`,
            );
        } else {
            await fetch(`https://fanix.io/backend/misc/ranking.php`)
                .then(response => {
                    return response.json();
                })
                .then(async data => {
                    const ownerAvatar = (
                        await message.client.fetchUser('185053226641522690')
                    ).avatarURL;
                    const leaderboardEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle('Leaderboard')
                        .setURL('https://fanix.io')
                        .addField(data[0].username, `${data[0].xp} XP`)
                        .addField(data[1].username, `${data[1].xp} XP`)
                        .addField(data[2].username, `${data[2].xp} XP`)
                        .addField(data[3].username, `${data[3].xp} XP`)
                        .addField(data[4].username, `${data[4].xp} XP`)
                        .setFooter('Made with ♥ by Pake#0001', ownerAvatar);

                    message.channel.send(leaderboardEmbed);
                })
                .catch(() => {
                    return message.channel.send(
                        'Oops! Looks like something went wrong with your request. Please try it again later.',
                    );
                });
        }
    },
};
