module.exports = {
    name: 'rename',
    description: 'Renames your clan',
    guildOnly: true,
    async execute(message, args, clan, member) {


        const authorUserId = message.author.id;
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClans = JSON.parse(JSON.stringify(memberClanData));
        const ownedClanData = await clan.findOne({where: {name: memberClans.clanName}});
        const ownedClan = JSON.parse(JSON.stringify(ownedClanData));

        if (!args.length) {
            return message.channel.send(`Unknown command. Use ${prefix}help to get a list of all commands.`)
        } else if (args.length >= 0 && args.length < 1) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        // Get the clan name as a string out of the argument-array
        let newClanName = args;
        let newFullClanName = newClanName.join(',').replace(/,/g, ' ').split();
        const newFinalClanName = newFullClanName.toString().toLowerCase();

        if (newFinalClanName.length > 25) {
            message.channel.send('Your new clan name is too long. You can only use up to **25** characters in your name.');
        }

        const oldClanName = ownedClan.name;

        if (ownedClan.ownerUserId === authorUserId) {
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
        } else {
            return message.channel.send(`You have no permissions to rename the clan **${oldClanName}**`);
        }

    }
};
