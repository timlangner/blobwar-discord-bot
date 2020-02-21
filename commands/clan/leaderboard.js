const Discord = require('discord.js');
const fetch = require('node-fetch');
const { prefix } = require('../../config');

module.exports = {
    name: 'leaderboard',
    description: 'Shows the fanix top 10 leaderboard',
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
                    let leaderboardEmbed = new Discord.RichEmbed()
                        .setColor('#E3B520')
                        .setTitle('Leaderboard')
                        .setURL('https://fanix.io')
                        .setDescription(
                            'Here is the top 10 ranking leaderboard of fanix.',
                        )
                        .setThumbnail('https://i.imgur.com/davX7Gc.png')
                        .setFooter('Made with ♥ by Pake#0001', ownerAvatar);

                    for (let i = 0; i < data.length; i++) {
                        let userRank;

                        switch (parseInt(data[i].rank)) {
                            case 10:
                                userRank = 'Rookie I';
                                break;
                            case 20:
                                userRank = 'Rookie II';
                                break;
                            case 30:
                                userRank = 'Rookie III';
                                break;
                            case 40:
                                userRank = 'Hero I';
                                break;
                            case 50:
                                userRank = 'Hero II';
                                break;
                            case 60:
                                userRank = 'Hero III';
                                break;
                            case 70:
                                userRank = 'Master I';
                                break;
                            case 80:
                                userRank = 'Master II';
                                break;
                            case 90:
                                userRank = 'Master III';
                                break;
                            case 100:
                                userRank = 'Legend';
                                break;
                            default:
                                userRank = 'undefined';
                                break;
                        }

                        if (i <= 4) {
                            if (i >= 1) {
                                leaderboardEmbed.addBlankField();
                            }
                            leaderboardEmbed.addField(
                                `${i + 1}. ${data[i].username}`,
                                `${data[i].xp} XP`,
                                true,
                            );
                            leaderboardEmbed.addField(`Rank: `, userRank, true);
                        }
                    }

                    message.channel.send(leaderboardEmbed);
                });
        }
    },
};
