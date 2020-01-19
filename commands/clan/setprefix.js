const {prefix} = require('../../config');

module.exports = {
    name: 'setprefix',
    description: 'Sets a prefix for your clan.',
    guildOnly: true,
    async execute(message, args, clan, member) {
        let isOwnerOfClan = false;

        const authorUserId = await message.author.id;
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClan = JSON.parse(JSON.stringify(memberClanData));
        if (memberClan === null) {
            return message.channel.send(`You're not in a clan. Use **${prefix}help** if you want to know how to create a clan.`);
        }
        const allMemberClanData = await member.findAll({where: {clanName: memberClan.clanName}});
        const allMemberClan = JSON.parse(JSON.stringify(allMemberClanData));
        const ownedClanData = await clan.findOne({where: {name: memberClan.clanName}});
        const ownedClan = JSON.parse(JSON.stringify(ownedClanData));

        if (!args.length) {
            return message.channel.send(`You didn't provide a prefix, ${message.author}!`);
        }

        // Check if user is in a clan
        if (ownedClan !== null && ownedClan.ownerUserId === message.author.id) {
            isOwnerOfClan = true;
        }

        console.log(message.guild.members.find(member => member.user.username === allMemberClan[0].username));

        if (isOwnerOfClan) { // Owner
            if (args[0].length <= 3) {
                await clan.update(
                    {
                        prefix: args[0]
                    },
                    {
                        where: {name: ownedClan.name}
                    }
                );
                for (let i=0; i < allMemberClan.length; i++) {
                    if (message.guild.ownerID === allMemberClan[i].memberUserId) {
                        console.log(`Couldn't change owners nickname.`);
                    } else {
                        await message.guild.members.find(member => member.user.username === allMemberClan[i].username).setNickname(`[${args[0]}] ${allMemberClan[i].username}`);
                        console.log('Changed nickname');
                    }
                }
                return message.channel.send(`You successfully set a prefix for your clan **${memberClan.clanName}**.`);
            } else {
                return message.channel.send(`Your prefix is too long! It can't be longer than 3 characters.`);
            }

        } else { // Member
            return message.channel.send(`You've no permissions to set a prefix for the clan **${memberClan.clanName}**.`);
        }
    }
};
