const {prefix} = require('../../config');

module.exports = {
    name: 'kick',
    description: 'Kicks a member of your current clan',
    guildOnly: true,
    async execute(message, args, clan, member) {

        const mentionedUser = message.mentions.members.first();
        const authorUserId = message.author.id;
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClans = JSON.parse(JSON.stringify(memberClanData));
        if (memberClans === null) {
            return message.channel.send(`You're not in a clan. Use **${prefix}help** if you want to know how to create a clan.`);
        }
        const allMemberClanData = await member.findAll({where: {clanName: memberClans.clanName}});
        const allMemberClans = JSON.parse(JSON.stringify(allMemberClanData));
        const ownedClanData = await clan.findOne({where: {name: allMemberClans[0].clanName}});
        const ownedClan = JSON.parse(JSON.stringify(ownedClanData));

        if (!mentionedUser) {
            return message.channel.send("You didn't mention a user.");
        } else if (mentionedUser.id === authorUserId) {
            return message.channel.send("You cant kick yourself. Use ``!c leave`` to disband your clan.");
        } else if (authorUserId === ownedClan.ownerUserId && allMemberClans.find(member => member.memberUserId === mentionedUser.id)) {
            await mentionedUser.removeRole(clanRoleId);
            await member.destroy({ where: { memberUserId: mentionedUser.id}});
            return message.channel.send(`You've successfully kicked <@${mentionedUser.user.id}> from your clan **${ownedClan.name}**!`);
        } else if (authorUserId === ownedClan.ownerUserId) {
            return message.channel.send('Your clan has no members. Go and invite some people.');
        } else if (allMemberClans.find(member => member.memberUserId === mentionedUser.id)) {
            return message.channel.send(`You have no permissions to kick someone from the clan **${ownedClan.name}**.`);
        } else {

        }

    }
};
