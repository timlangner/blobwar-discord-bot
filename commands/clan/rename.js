const {prefix} = require('../../config');

module.exports = {
    name: 'rename',
    description: 'Renames your clan',
    guildOnly: true,
    async execute(message, args, clan, member) {


        const authorUserId = message.author.id;
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClans = JSON.parse(JSON.stringify(memberClanData));
        if (memberClans === null) {
            return message.channel.send(`You're not in a clan. Use **${prefix}help** if you want to know how to create a clan.`);
        }
        const ownedClanData = await clan.findOne({where: {name: memberClans.clanName}});
        const ownedClan = JSON.parse(JSON.stringify(ownedClanData));

        if (!args.length) {
            return message.channel.send(`You have to provide a name in order to rename your clan.`);
        } else if (typeof args === 'string') {
            return message.channel.send(`You have to provide a string in order to rename your clan.`)
        }

        // Get the clan name as a string out of the argument-array
        let newClanName = args;
        let newFullClanName = newClanName.join(',').replace(/,/g, ' ').split();
        const newFinalClanName = newFullClanName.toString().toLowerCase();
        const regEx = /[.\-,;\n:<>|@!"$%&`/()=?{[\]}´+*#'~]/;

        const oldClanName = ownedClan.name;

        if (ownedClan.ownerUserId === authorUserId) {
            if (newFinalClanName.length > 25) {
                return message.channel.send('Your new clan name is too long. You can only use up to **25** characters in your name.');
            } else if (regEx.test(newFinalClanName)) {
                return message.channel.send('Your new clan name contains unsupported characters. Please try a different name.');
            } else {
                await member.update(
                    {
                        clanName: newFinalClanName
                    },
                    {
                        where: {clanName: oldClanName}
                    }
                );
                await clan.update(
                    {
                        name: newFinalClanName
                    },
                    {
                        where: {ownerUserId: authorUserId}
                    }
                );

                await message.guild.channels.find(channel => channel.name === oldClanName).setName(newFinalClanName);
                await message.guild.roles.find(role => role.id === ownedClan.roleId).edit(
                    { name: newFinalClanName,}
                );
                return message.channel.send(`You've successfully renamed your clan **${oldClanName}** to **${newFinalClanName}**`);
            }
        } else {
            return message.channel.send(`You have no permissions to rename the clan **${oldClanName}**`);
        }

    }
};
