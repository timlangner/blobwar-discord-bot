
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

            // Get the clan name as a string out of the argument-array
            let clanName = args.slice(1);
            let fullClanName = clanName.join(',').replace(/,/g, ' ').split();
            const finalClanName = fullClanName.toString();

            // Check if clan name is longer than 25 characters
            if (finalClanName.length > 25) {
                message.channel.send('Your clan name is too long. You can only use up to **25** characters in your name.');
            }
            else {
                // Creates a new role with the name of the second argument
                const createdRole = await message.guild.createRole({
                    name: finalClanName,
                    permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS']
                });
                message.member.addRole(createdRole).then(r => console.log("promise"));

                // Creates Clan Channel in Category
                message.guild.createChannel(finalClanName, 'text',[{
                    type: 'role',
                    id: message.guild.id,
                    deny: 0x400
                },
                {
                    type: 'role',
                    id: createdRole.id,
                    allow: ['VIEW_CHANNEL'],
                }]).then(channel => {
                    let category = message.guild.channels.find(c => c.name == "Clan Area" && c.type == "category");

                    if (!category) throw new Error("Category channel does not exist");
                    channel.setParent(category.id);
                }).catch(console.error);

                return message.channel.send(`You've successfully created the clan **${finalClanName}**`);
            }
        }
    },
};
