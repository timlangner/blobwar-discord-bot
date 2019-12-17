
const {prefix} = require('../../config');

module.exports = {
    name: 'leave',
    description: 'Leaves your current clan',
    guildOnly: true,
    async execute(message, args, clan, member) {
        let isOwnerOfClan = false;

        const authorUserId = await message.author.id;
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClan = JSON.parse(JSON.stringify(memberClanData));
        const ownedClanData = await clan.findOne({where: {name: memberClan.clanName}});
        const ownedClan = JSON.parse(JSON.stringify(ownedClanData));

        // const clanRoleIdData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['roleId']});
        // const clanRoleId = JSON.parse(JSON.stringify(clanRoleIdData)).roleId;

        // Check if user is in a clan
        if (ownedClan !== null && ownedClan.ownerUserId === message.author.id) {
            isOwnerOfClan = true;
        }

        if (ownedClan === null) { // No Clan
            return message.channel.send(`You're not in a clan. **Create** or join a clan first before you try to leave it.`);
        } else if (isOwnerOfClan) { // Owner
            await message.guild.roles.find(role => role.id === ownedClan.roleId).delete();
            await message.guild.channels.find(channel => channel.name === ownedClan.name).delete();
            await clan.destroy({ where: { ownerUserId: ownedClan.ownerUserId } });
            await member.destroy({ where: { clanName: memberClan.clanName } });
            return message.channel.send(`You successfully disbanded your own clan **${memberClan.clanName}**.`);
        } else { // Member
            await message.member.removeRole(ownedClan.roleId);
            member.destroy({ where: { memberUserId: message.author.id } });
            return message.channel.send(`You successfully left the clan **${memberClan.clanName}**.`);
        }
    }
};
