module.exports = {
    name: 'kick',
    description: 'Kicks a member of your current clan',
    guildOnly: true,
    async execute(message, args, clan, member) {

        const mentionedUser = message.mentions.members.first();
        const authorUserId = message.author.id;
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClans = JSON.parse(JSON.stringify(memberClanData));
        const allMemberClanData = await member.findAll({where: {clanName: memberClans.clanName}});
        const allMemberClans = JSON.parse(JSON.stringify(allMemberClanData));
        const ownedClanData = await clan.findOne({where: {name: allMemberClans[0].clanName}});
        const ownedClan = JSON.parse(JSON.stringify(ownedClanData));

        if (mentionedUser.id === authorUserId) {
            return message.channel.send("can't kick yourself");
        } else if (authorUserId === ownedClan.ownerUserId && allMemberClans.find(member => member.memberUserId === mentionedUser.id)) {
            await member.destroy({ where: { memberUserId: mentionedUser.id}});
            return message.channel.send('kicked');
        } else if (authorUserId === ownedClan.ownerUserId) {
            return message.channel.send('No Member');
        } else if (allMemberClans.find(member => member.memberUserId === mentionedUser.id)) {
            return message.channel.send('No Admin');
        } else {

        }

    }
};
