const {prefix} = require('../../config');

module.exports = {
    name: 'removeprefix',
    description: 'Removes the prefix for your clan.',
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

        // Check if user is in a clan
        if (ownedClan !== null && ownedClan.ownerUserId === message.author.id) {
            isOwnerOfClan = true;
        }

        if (ownedClan === null) { // No Clan
            return message.channel.send(`You're not in a clan. **Create** or join a clan first.`);
        } else if (isOwnerOfClan) { // Owner
            if (ownedClan.prefix === null) {
                return message.channel.send(`Your Clan has no prefix.`);
            } else {
                await clan.update(
                    {
                        prefix: null
                    },
                    {
                        where: {name: ownedClan.name}
                    }
                );
                for (let i=0; i < allMemberClan.length; i++) {
                    await  message.guild.members.find(member => member.user.username === allMemberClan[i].username).setNickname(`${allMemberClan[i].username}`);
                }

                return message.channel.send(`You successfully removed the prefix for your clan **${memberClan.clanName}**.`);
            }
        } else { // Member
            await message.member.removeRole(ownedClan.roleId);
            member.destroy({ where: { memberUserId: message.author.id } });
            return message.channel.send(`You've no permissions to remove the prefix for the clan **${memberClan.clanName}**.`);
        }
    }
};
