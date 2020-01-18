const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'stats',
    description: 'Shows the fanix server stats',
    guildOnly: true,
    async execute(message, args, clan, member) {
        if (!args.length) {
            return message.channel.send(`You didn't provide a server, ${message.author}!`);
        } else {

            await fetch(`https://eu.fanix.io:2199/`)
                .then((response) => {
                    return response.json();
                })
                .then(async (data) => {
                    if (args[0] === 'Ultrasplit') {
                        const ownerAvatar = (await message.client.fetchUser('185053226641522690')).avatarURL;
                        const serverEmbed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle(`${args[0]}`)
                            .setURL('https://fanix.io/')
                            .setDescription(`Here are some stats about the Ultrasplit servers.`)
                            .addField('Total Players', `${data.Ultrasplit}`, true)
                            .addField('Overview:', `${data.Ultrasplit}`, true)
                            .addField(`Servers`, `${data.Ultrasplit.length}`, true)
                            .setFooter('Made with ♥ by Pake#0001', ownerAvatar);
                        return message.channel.send(serverEmbed);
                    }
                }).catch(() => {
                    return message.channel.send('Oops! Looks like something went wrong with your request. Please try it again later.');
                });
        }
    }
};
