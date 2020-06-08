const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays all available commands',
    guildOnly: true,
    async execute(message) {
        const ownerAvatar = (
            await message.client.fetchUser('185053226641522690')
        ).avatarURL;
        const mainCommands = [
            `!c profile <username> - Check your Fanix profile`,
            `!c leaderboard - Check the Top 10 Leaderboard`,
            `!c suggest - Create a suggestion for the game`,
        ];
        const otherCommands = [
            `!c help - List of all commands`,
        ];

        const infoEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('Commands')
            .setURL('https://blobwar.io')
            .setDescription('Here are all available commands that you can use.')
            .setThumbnail(
                'https://media.discordapp.net/attachments/719290108028780568/719580167827357815/BlobWar-02.png?width=692&height=677',
            )
            .addField('Main', mainCommands)
            .addField('Other', otherCommands)
            .setFooter('Made with ♥ by Pake#0001', ownerAvatar);

        return message.channel.send(infoEmbed);
    },
};
