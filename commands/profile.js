const Discord = require('discord.js');
const fetch = require('node-fetch');

const secondsToHms = timeInSeconds => {
    timeInSeconds = Number(timeInSeconds);
    var h = Math.floor(timeInSeconds / 3600);
    var m = Math.floor((timeInSeconds % 3600) / 60);
    var s = Math.floor((timeInSeconds % 3600) % 60);

    return h + ':' + m + ':' + s;
};

module.exports = {
    name: 'profile',
    description: 'Shows the fanix profile of the user',
    guildOnly: true,
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(
                `You didn't provide a username, ${message.author}!`,
            );
        } else {
            let username = encodeURI(args[0]);
            let userXP;
            let userLevel;
            let userRank;
            let userKills;
            let userDeaths;
            let userKD;
            let userTimePlayed;

            let rankPicURL;

            await fetch(`http://eu.fanix.io:7000/api/getRank/${username}`)
                .then(response => {
                    return response.json();
                })
                .then(async data => {
                    if (data.length === 0) {
                        return message.channel.send(
                            'Please provide a valid username.',
                        );
                    }
                    console.log(data);
                    userXP = data.map(user => user.xp);
                    userLevel = data.map(user => user.level);
                    userKills = data.map(user => user.kills);
                    userDeaths = data.map(user => user.deaths);
                    userKD = Math.round((userKills / userDeaths) * 100) / 100;
                    userTimePlayed = data.map(user => user.timePlayed);

                    switch (userLevel[0]) {
                        case 10:
                            userRank = 'Rookie I';
                            rankPicURL = 'https://i.imgur.com/EgvtV0h.png';
                            break;
                        case 20:
                            userRank = 'Rookie II';
                            rankPicURL = 'https://i.imgur.com/m4n01WZ.png';
                            break;
                        case 30:
                            userRank = 'Rookie III';
                            rankPicURL = 'https://i.imgur.com/ozDfsSa.png';
                            break;
                        case 40:
                            userRank = 'Hero I';
                            rankPicURL = 'https://i.imgur.com/wETHojW.png';
                            break;
                        case 50:
                            userRank = 'Hero II';
                            rankPicURL = 'https://i.imgur.com/OdZDBAS.png';
                            break;
                        case 60:
                            userRank = 'Hero III';
                            rankPicURL = 'https://i.imgur.com/dzE0PjE.png';
                            break;
                        case 70:
                            userRank = 'Master I';
                            rankPicURL = 'https://i.imgur.com/6ibm5Co.png';
                            break;
                        case 80:
                            userRank = 'Master II';
                            rankPicURL = 'https://i.imgur.com/RWuvZc6.png';
                            break;
                        case 90:
                            userRank = 'Master III';
                            rankPicURL = 'https://i.imgur.com/nc4cr4e.png';
                            break;
                        case 100:
                            userRank = 'Legend';
                            rankPicURL = 'https://i.imgur.com/yLJohWF.png';
                            break;
                        default:
                            userRank = 'undefined';
                            break;
                    }

                    const ownerAvatar = (
                        await message.client.fetchUser('185053226641522690')
                    ).avatarURL;
                    const profileEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${args[0]}`)
                        .setURL('https://fanix.io/')
                        .setDescription(
                            `Here's some information about the user **${args[0]}**!`,
                        )
                        .setThumbnail(rankPicURL)
                        .addField('Current rank', `${userRank}`, true)
                        .addField('Total XP:', `${userXP}`, true)
                        .addField(
                            `Time Played`,
                            secondsToHms(userTimePlayed),
                            true,
                        )
                        .addField(`Kills`, `${userKills}`, true)
                        .addField(`Deaths`, `${userDeaths}`, true)
                        .addField(`K/D`, `${userKD}`, true)
                        .setFooter('Made with ♥ by Pake#0001', ownerAvatar);
                    return message.channel.send(profileEmbed);
                })
                .catch(() => {
                    return message.channel.send(
                        'Oops! Looks like something went wrong with your request. Please try it again later.',
                    );
                });
        }
    },
};
