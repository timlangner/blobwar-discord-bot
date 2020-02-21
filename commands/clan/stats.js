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
            const input = args[0];
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
        }
    },
};
