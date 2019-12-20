module.exports = {
    name: 'setprefix',
    description: 'Sets a prefix for your clan.',
    guildOnly: true,
    async execute(message, args, clan, member) {
        let isOwnerOfClan = false;

        const authorUserId = await message.author.id;
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClan = JSON.parse(JSON.stringify(memberClanData));
        const allMemberClanData = await member.findAll({where: {clanName: memberClan.clanName}});
        const allMemberClan = JSON.parse(JSON.stringify(allMemberClanData));
        const ownedClanData = await clan.findOne({where: {name: memberClan.clanName}});
        const ownedClan = JSON.parse(JSON.stringify(ownedClanData));

        if (!args.length) {
            return message.channel.send(`Unknown command. Use ${prefix}help to get a list of all commands.`)
        } else if (args.length >= 0 && args.length < 1) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        // Check if user is in a clan
        if (ownedClan !== null && ownedClan.ownerUserId === message.author.id) {
            isOwnerOfClan = true;
        }

        console.log(message.guild.members.find(member => member.user.username === allMemberClan[0].username));

        if (ownedClan === null) { // No Clan
            return message.channel.send(`You're not in a clan. **Create** or join a clan first before you try to leave it.`);
        } else if (isOwnerOfClan) { // Owner
            await clan.update(
                {
                    prefix: args[0]
                },
                {
                    where: {name: ownedClan.name}
                }
            );
            for (let i=0; i < allMemberClan.length; i++) {
                await  message.guild.members.find(member => member.user.username === allMemberClan[i].username).setNickname(`[${args[0]}] ${allMemberClan[i].username}`);
            }

            return message.channel.send(`You successfully set a prefix for your clan **${memberClan.clanName}**.`);
        } else { // Member
            await message.member.removeRole(ownedClan.roleId);
            member.destroy({ where: { memberUserId: message.author.id } });
            return message.channel.send(`You've no permissions to set a prefix for the clan **${memberClan.clanName}**.`);
        }
    }
};
