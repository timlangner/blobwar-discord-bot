const Discord = require('discord.js');
const {prefix} = require('../../config');

module.exports = {
    name: 'invite',
    description: 'Invites a user to a Clan',
    guildOnly: true,
    async execute(message, args, clan, member) {
        let isOwnerOfClan = true;
        let isMemberOfClan = true;
        let allMemberClanData;
        let allMemberClan;

        const authorUserId = message.author.id;
        const authorUsername = (await message.client.fetchUser(message.author.id)).username;
        const authorAvatar = (await message.client.fetchUser(authorUserId)).avatarURL;
        const mentionedUser = message.mentions.members.first();
        const memberClanData = await member.findOne({where: {memberUserId: authorUserId}});
        const memberClan = JSON.parse(JSON.stringify(memberClanData));
        const ownedClanData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['ownerUserId']});
        const ownedClanOwnerId = JSON.parse(JSON.stringify(ownedClanData)).ownerUserId;
        const ownedClanNameData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['name']});
        const ownedClanName = JSON.parse(JSON.stringify(ownedClanNameData));
        const clanRoleIdData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['roleId']});
        const clanRoleId = JSON.parse(JSON.stringify(clanRoleIdData)).roleId;
        const currentMemberCountData = await clan.findOne({where: {ownerUserId: authorUserId}, attributes: ['memberCount']});
        const currentMemberCount = JSON.parse(JSON.stringify(currentMemberCountData)).memberCount;

        // Check if user is already in a clan
        if (ownedClanData.length < 1) {
            isOwnerOfClan = false;
        }
        if (memberClan.length < 1) {
            isMemberOfClan = false;
        }

        if (!args.length) {
            return message.channel.send(`Unknown command. Use ${prefix}help to get a list of all commands.`)
        } else if (args.length >= 0 && args.length < 0) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        } else if (!isOwnerOfClan) {
            return message.channel.send(`You're not an owner of a clan. **Create** an own clan first and then try it again.`);
        } else if (isOwnerOfClan && mentionedUser.id === ownedClanOwnerId) {
            return message.channel.send(`You're the owner of the clan. You can't invite yourself ;)`);
        } else if (isOwnerOfClan) {
            const inviteEmbed = new Discord.RichEmbed()
                .setColor('#0000ff')
                .setTitle('You got invited!')
                .setDescription(`${authorUsername} invited you to join the Clan **${ownedClanName.name}**! React to accept or decline.`)
                .setThumbnail(authorAvatar);

            const acceptEmbed = new Discord.RichEmbed()
                .setColor('#40ff00')
                .setTitle('SUCCESS')
                .setDescription(`You've successfully accepted the invitation and received access to your clan area.`);

            const declineEmbed = new Discord.RichEmbed()
                .setColor('#ff0000')
                .setTitle('SUCCESS')
                .setDescription(`You've successfully declined the invitation and will not receive access to the clan area.`);

            if (mentionedUser.id === memberClan.memberUserId) {
                message.channel.send(`You can't invite a user that is already in your clan.`);
            } else {
                mentionedUser.send(inviteEmbed).then(embedMessage => {
                    embedMessage.react('✅').then(() => embedMessage.react('❌'));
                    message.channel.send(`You've successfully invited <@${mentionedUser.id}>. He received a DM where he can **accept** or **decline** your clan invitation.`);

                    const filter = (reaction, user) => {
                        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === mentionedUser.id;
                    };

                    embedMessage.awaitReactions(filter, {max: 1})
                        .then(async collected => {
                            allMemberClanData = await member.findAll({where: {clanName: memberClan.clanName}});
                            allMemberClan = JSON.parse(JSON.stringify(allMemberClanData));

                            if (!allMemberClan.find(member => member.memberUserId === mentionedUser.id)) {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '✅') {
                                    const user = await message.client.fetchUser(mentionedUser.id);
                                    console.log('USEROBJECT', user);
                                    console.log('USERNAME', user.username);
                                    await mentionedUser.addRole(clanRoleId);
                                    await member.create({
                                        username: user.username,
                                        memberUserId: mentionedUser.id,
                                        clanName: ownedClanName.name,
                                    });
                                    await clan.update(
                                        {
                                            memberCount: currentMemberCount + 1
                                        },
                                        {
                                            where: {name: ownedClanName.name}
                                        });
                                    await mentionedUser.send(acceptEmbed);
                                } else {
                                    await mentionedUser.send(declineEmbed);
                                }
                            } else {
                                return mentionedUser.send(`You're already in a clan.`);
                            }
                        })
                });
            }
        }
    }
};
