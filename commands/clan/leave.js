
const {prefix} = require('../../config');

module.exports = {
    name: 'leave',
    description: 'Leaves your current clan',
    guildOnly: true,
    async execute(message, args, clan, member) {
        let isOwnerOfClan = true;
        let isMemberOfClan = true;


        const authorUserId = await message.author.id;
        // const authorUsername = (await message.client.fetchUser(message.author.id)).username;
        // const authorAvatar = (await message.client.fetchUser(authorUserId)).avatarURL;
        // const mentionedUser = message.mentions.members.first();
        const memberClan = await member.findAll({where: {memberUserId: authorUserId}});
        const ownedClanData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['ownerUserId']});
        const ownedClanOwnerId = JSON.parse(JSON.stringify(ownedClanData)).ownerUserId.catch(() => console.log('No ownerUserId found'));
        const ownedClanNameData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['name']});
        const ownedClanName = JSON.parse(JSON.stringify(ownedClanNameData));
        const clanRoleIdData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['roleId']});
        // const clanRoleId = JSON.parse(JSON.stringify(clanRoleIdData)).roleId;

        console.log('OWNER', ownedClanOwnerId);

        // Check if user is in a clan
        if (ownedClanData.length < 1) {
            isOwnerOfClan = false;
        }
        if (memberClan.length < 1) {
            isMemberOfClan = false;
        }

        if (!isOwnerOfClan && !isMemberOfClan) {
            return message.channel.send(`You're not in a clan. **Create** or join a clan first before you try to leave it.`);
        } else if (isOwnerOfClan) {
            return message.channel.send(`Are you sure you want to leave your own clan **${ownedClanName}**?`);
        } else if (isMemberOfClan) {
            return message.channel.send(`Are you sure you want to leave the clan **${ownedClanName}**?`);
        }
    }
};
