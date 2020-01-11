const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'profile',
    description: 'Shows the fanix profile of the user',
    guildOnly: true,
    async execute(message, args, clan, member) {
        if (!args.length) {
            return message.channel.send(`You didn't provide a username, ${message.author}!`);
        } else {
            let userData;

            fetch(`http://eu.fanix.io:7000/api/${args[0]}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.length === 0) {
                        return message.channel.send('Please provide a valid username.');
                    }
                    userData = data.map();
                    console.log(userData);
                });
            if (userData) {
                const profileEmbed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Pake's Profile`)
                    .setURL('https://fanix.io/')
                    .setDescription(`Here's some information about the user **${args[0]}**!`)
                    .setThumbnail(message.author.avatarURL)
                    .addField('Current rank', `Hero I`, true)
                    .addField('Total XP:', `${userData.xp}`, true)
                    .addField(`Time Played`, `09:27:02`, true)
                    .addField(`Kills`, `2102`, true)
                    .addField(`Deaths`, `1433`, true)
                    .addField(`K/D`, `1.33`, true)
                    .setFooter('Made with ♥ by Pake#0001');
                return message.channel.send(profileEmbed);
            }
        }
    }
};
