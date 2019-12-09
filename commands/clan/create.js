const Discord = require('discord.js');
const {prefix} = require('../../config');

module.exports = {
    name: 'create',
    description: 'Creates a new clan!',
    guildOnly: true,
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(`Unknown command. Use ${prefix}c help to get a list of all commands.`)
        } else if (args[0] === 'create') {
            if (args.length >= 1 && args.length < 2) {
                return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            }
            let clanName = args.slice(1);
            let fullClanName = clanName.join(',').replace(/,/g, ' ').split();
            //Creates a new role with the name of the second argument
            const createdRole = await message.guild.createRole({
                name: fullClanName.toString(),
                permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS']
            });
            message.member.addRole(createdRole).then(r => console.log("promise"));
            return message.channel.send(`You've successfully created the clan **${fullClanName.toString()}**`);
        }
    },
};
