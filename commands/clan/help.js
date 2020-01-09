const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays all available commands,',
    guildOnly: true,
    async execute(message) {

        const ownerAvatar = (await message.client.fetchUser('185053226641522690')).avatarURL;
        const mainCommands = [`!c create <name> - Create a clan`, `!c leave - Leave your current clan`];
        const manageCommands = [`!c invite <@user> - Invite a player to your clan`, `!c kick <@player> - Kick a player from your clan`, `!c rename <name> - Rename your clan`];
        const customizeCommands = [`!c prefix <prefix> - Sets your clan's prefix`, `!c removeprefix - Removes your clan’s custom prefix`];
        const otherCommands = [`!c help - List of all commands`, `!c info <clan> - Get informations of a clan`];

        const infoEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('Commands')
            .setURL('https://discord.js.org/')
            .setDescription('Here are all available commands that you can use.')
            .setThumbnail('https://i.imgur.com/davX7Gc.png')
            .addField('Main', mainCommands)
            .addField('Manage', manageCommands)
            .addField('Customize', customizeCommands)
            .addField('Other', otherCommands)
            .setFooter('Made with ♥ by Pake#0001', ownerAvatar);

        return message.channel.send(infoEmbed);
    }
};
