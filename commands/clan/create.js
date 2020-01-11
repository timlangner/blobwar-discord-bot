const {prefix} = require('../../config');

// TODO: Add GuildId to db
module.exports = {
    name: 'create',
    description: 'Creates a new clan!',
    guildOnly: true,
    async execute(message, args, clan, member) {
        let isOwnerOfClan = true;
        let isMemberOfClan = true;

        const authorUserId = message.author.id;
        const ownedClan = await clan.findAll({where: {ownerUserId: authorUserId}});
        const memberClan = await member.findAll({where: {memberUserId: authorUserId}});

        // Check if user is already in a clan
        if (ownedClan.length < 1) {
            isOwnerOfClan = false;
        }
        if (memberClan.length < 1) {
            isMemberOfClan = false;
        }

        if (!args.length) {
            return message.channel.send(`You didn't provide a clan name, ${message.author}!`);
        } else if (isOwnerOfClan || isMemberOfClan) {
            return message.channel.send(`You're already in a clan. **Leave** it first and then try it again.`);
        }

        // Get the clan name as a string out of the argument-array
        let clanName = args;
        let fullClanName = clanName.join(',').replace(/,/g, ' ').split();
        const finalClanName = fullClanName.toString().toLowerCase();
        const regEx = /[.\-,;\n:<>|@!"$%&`/()=?{[\]}´+*#'~]/;

        // Check if clan name is longer than 25 characters
        if (finalClanName.length > 25) {
            return message.channel.send('Your clan name is too long. You can only use up to **25** characters in your name.');
        } else if (regEx.test(finalClanName)) {
            return message.channel.send('Your clan name contains unsupported characters. Please try a different name.');
        } else {
            // Add Clan into the database
            try {
                const createdRole = await message.guild.createRole({
                    name: finalClanName,
                });
                await clan.create({
                    name: finalClanName,
                    ownerUserId: message.author.id,
                    roleId: createdRole.id,
                    memberCount: 1,
                });
                await member.create({
                    username: message.author.username,
                    memberUserId: message.author.id,
                    clanName: finalClanName,
                });
                await message.member.addRole(createdRole);

                // Creates Clan Channel in Category
                message.guild.createChannel(finalClanName, 'text', [{
                    type: 'role',
                    id: message.guild.id,
                    deny: 0x400
                },
                    {
                        type: 'role',
                        id: createdRole.id,
                        allow: ['VIEW_CHANNEL'],
                    }]).then(channel => {
                    let category = message.guild.channels.find(c => c.name === "Clan Area" && c.type === "category");

                    if (!category) throw new Error("Category channel does not exist");
                    channel.setParent(category.id);
                }).catch(console.error);

                return message.channel.send(`You've successfully created the clan **${finalClanName}**`);
            } catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return message.reply('That clan already exists.');
                }
                return message.reply('Something went wrong with adding a clan.');
            }

        }
    }
};
