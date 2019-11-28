const Discord = require('discord.js');
const {prefix} = require('../../config');

module.exports = {
    name: 'create',
    description: 'Creates a new clan!',
    guildOnly: true,
    execute(message, args) {
        if (!args.length) {
            return message.channel.send(`Unknown command. Use ${prefix}c help to get a list of all commands.`)
        } else if (args[0] === 'create') {
            if (args.length >= 1 && args.length < 2) {
                return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            }
            // message.guild.createRole({ name: args[1], permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] });
            // const createdRole = message.guild.roles.find(role => role.name === args[1]);
            // message.member.addRole(createdRole);
            return message.channel.send(`You've successfully created the clan **${args[1]}**`);
        }
    },
};