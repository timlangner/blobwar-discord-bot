
const {prefix} = require('../../config');

module.exports = {
    name: 'leave',
    description: 'Leaves your current clan',
    guildOnly: true,
    async execute(message, args, clan, member) {
        let isOwnerOfClan = true;
        let isMemberOfClan = true;


        const authorUserId = await message.author.id;
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClan = JSON.parse(JSON.stringify(memberClanData));
        const ownedClanData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['ownerUserId']});
        const ownedClanOwnerId = JSON.parse(JSON.stringify(ownedClanData)).ownerUserId;
        const ownedClanNameData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['name']});
        const ownedClanName = JSON.parse(JSON.stringify(ownedClanNameData));
        const clanRoleIdData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['roleId']});
        const clanRoleId = JSON.parse(JSON.stringify(clanRoleIdData)).roleId;

        // Check if user is in a clan
        if (ownedClanData.length < 1) {
            isOwnerOfClan = false;
        }
        if (memberClanData.length < 1) {
            isMemberOfClan = false;
        }

        if (!isOwnerOfClan && !isMemberOfClan) {
            return message.channel.send(`You're not in a clan. **Create** or join a clan first before you try to leave it.`);
        } else if (isOwnerOfClan) {
            clan.destroy({ where: { ownerUserId: ownedClanOwnerId } });
            return message.channel.send(`Are you sure you want to leave your own clan **${ownedClanName}**?`);
        } else if (isMemberOfClan) {
            return message.channel.send(`Are you sure you want to leave the clan **${ownedClanName}**?`);
        }
    }
};
