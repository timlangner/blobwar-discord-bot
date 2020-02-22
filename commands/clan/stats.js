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
    name: 'stats',
    description: 'Shows the fanix server stats',
    guildOnly: true,
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(
                `You didn't provide a server, ${message.author}!`,
            );
        } else {
            const servername = args;
            const fullInput = servername
                .join(',')
                .replace(/,/g, ' ')
                .split();
            const input = fullInput.toString().toLowerCase();
            const megasplit = [
                'http://eu.fanix.io:5751/',
                'http://eu.fanix.io:5752/',
            ];
            const crazy = [
                'http://eu.fanix.io:5951/',
                'http://eu.fanix.io:5952/',
            ];
            const crazyBots = [
                'http://eu.fanix.io:5551/',
                'http://eu.fanix.io:5552/',
            ];

            const ultrasplit = [
                'http://eu.fanix.io:5651/',
                'http://eu.fanix.io:5652/',
            ];

            const instant = [
                'http://eu.fanix.io:5451/',
                'http://eu.fanix.io:5452/',
            ];
            const battleRoyale = ['http://eu.fanix.io:5251/'];
            const ownerAvatar = (
                await message.client.fetchUser('185053226641522690')
            ).avatarURL;

            let serverEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle(input.toUpperCase())
                .setURL('https://fanix.io/')
                .setFooter('Made with ♥ by Pake#0001', ownerAvatar);

            if (input === 'megasplit') {
                for (let i = 0; i < megasplit.length; i++) {
                    if (i === 0) {
                        serverEmbed.setDescription(
                            'Here are some stats about the Megasplit servers.',
                        );
                    }
                    try {
                        const response = await fetch(megasplit[i]);
                        const stats = await response.json();
                        serverEmbed.addField(
                            `Megasplit ${i + 1}:`,
                            `${stats.current_players}/${stats.max_players} Players (${stats.spectators} Spectators)`,
                        );
                    } catch (e) {
                        serverEmbed.addField(`Megasplit ${i + 1}:`, `Offline`);
                    }
                }
                await message.channel.send(serverEmbed);
            } else if (input === 'crazy') {
                for (let i = 0; i < crazy.length; i++) {
                    if (i === 0) {
                        serverEmbed.setDescription(
                            'Here are some stats about the Crazy servers.',
                        );
                    }
                    try {
                        const response = await fetch(crazy[i]);
                        const stats = await response.json();
                        serverEmbed.addField(
                            `Crazy ${i + 1}:`,
                            `${stats.current_players}/${stats.max_players} Players (${stats.spectators} Spectators)`,
                        );
                    } catch (e) {
                        serverEmbed.addField(`Crazy ${i + 1}:`, `Offline`);
                    }
                }
                await message.channel.send(serverEmbed);
            } else if (input === 'crazy bots') {
                for (let i = 0; i < crazy.length; i++) {
                    if (i === 0) {
                        serverEmbed.setDescription(
                            'Here are some stats about the Crazy Bots servers.',
                        );
                    }
                    try {
                        const response = await fetch(crazyBots[i]);
                        const stats = await response.json();
                        serverEmbed.addField(
                            `Crazy Bots ${i + 1}:`,
                            `${stats.current_players}/${stats.max_players} Players (${stats.spectators} Spectators)`,
                        );
                    } catch (e) {
                        serverEmbed.addField(`Crazy Bots ${i + 1}:`, `Offline`);
                    }
                }
                await message.channel.send(serverEmbed);
            } else if (input === 'ultrasplit') {
                for (let i = 0; i < ultrasplit.length; i++) {
                    if (i === 0) {
                        serverEmbed.setDescription(
                            'Here are some stats about the Ultrasplit servers.',
                        );
                    }
                    try {
                        const response = await fetch(ultrasplit[i]);
                        const stats = await response.json();
                        serverEmbed.addField(
                            `Ultrasplit ${i + 1}:`,
                            `${stats.current_players}/${stats.max_players} Players (${stats.spectators} Spectators)`,
                        );
                    } catch (e) {
                        serverEmbed.addField(`Ultrasplit ${i + 1}:`, `Offline`);
                    }
                }
                await message.channel.send(serverEmbed);
            } else if (input === 'instant') {
                for (let i = 0; i < instant.length; i++) {
                    if (i === 0) {
                        serverEmbed.setDescription(
                            'Here are some stats about the Instant servers.',
                        );
                    }
                    try {
                        const response = await fetch(instant[i]);
                        const stats = await response.json();
                        serverEmbed.addField(
                            `Instant ${i + 1}:`,
                            `${stats.current_players}/${stats.max_players} Players (${stats.spectators} Spectators)`,
                        );
                    } catch (e) {
                        serverEmbed.addField(`Instant ${i + 1}:`, `Offline`);
                    }
                }
                await message.channel.send(serverEmbed);
            }
        }
    },
};
