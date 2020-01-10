module.exports = {
    name: 'leave',
    description: 'Leaves your current clan',
    guildOnly: true,
    async execute(message, args, clan, member) {
        let isOwnerOfClan = false;

        const authorUserId = await message.author.id;
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClan = JSON.parse(JSON.stringify(memberClanData));
        if (memberClan === null) {
            message.channel.send(`You're not in a clan. **Create** or join a clan first before you try to leave it.`);
        }
        const allMemberClanData = await member.findAll({where: {clanName: memberClan.clanName}});
        const allMemberClan = JSON.parse(JSON.stringify(allMemberClanData));
        const ownedClanData = await clan.findOne({where: {name: memberClan.clanName}});
        const ownedClan = JSON.parse(JSON.stringify(ownedClanData));

        // Check if user is in a clan
        if (ownedClan !== null && ownedClan.ownerUserId === message.author.id) {
            isOwnerOfClan = true;
        }

        if (ownedClan === null) { // No Clan
            return message.channel.send(`You're not in a clan. **Create** or join a clan first before you try to leave it.`);
        } else if (isOwnerOfClan) { // Owner
            await message.guild.roles.find(role => role.id === ownedClan.roleId).delete();
            console.log('----', ownedClan.name.replace(/\s/g, ""));
            await message.guild.channels.find(channel => channel.name === ownedClan.name.replace(/\s/g, "-")).delete();
            for (let i=0; i < allMemberClan.length; i++) {
                await message.guild.members.find(member => member.user.username === allMemberClan[i].username).setNickname(`${allMemberClan[i].username}`);
            }
            await clan.destroy({ where: { ownerUserId: ownedClan.ownerUserId } });
            await member.destroy({ where: { clanName: memberClan.clanName } });
            return message.channel.send(`You successfully disbanded your own clan **${memberClan.clanName}**.`);
        } else { // Member
            await message.member.removeRole(ownedClan.roleId);
            await message.member.setNickname(message.member.user.username);
            member.destroy({ where: { memberUserId: message.author.id } });

            return message.channel.send(`You successfully left the clan **${memberClan.clanName}**.`);
        }
    }
};
