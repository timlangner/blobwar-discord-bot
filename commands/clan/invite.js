
const Discord = require('discord.js');
const {prefix} = require('../../config');

module.exports = {
    name: 'invite',
    description: 'Invites a user to a Clan',
    guildOnly: true,
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(`Unknown command. Use ${prefix}help to get a list of all commands.`)
        } else if (args.length >= 0 && args.length < 0) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        const mentionedUser = message.mentions.users.first();
        const authorUserId = message.author.id;
        const authorUsername = (await message.client.fetchUser(message.author.id)).username;
        const authorAvatar = (await message.client.fetchUser(authorUserId)).avatarURL;

        const inviteEmbed = new Discord.RichEmbed()
            .setColor('#0000ff')
            .setTitle('You got invited!')
            .setDescription(`${authorUsername} invited you to join the Clan **CouchPotato**! React to accept or decline.`)
            .setThumbnail(authorAvatar);

        const acceptEmbed = new Discord.RichEmbed()
            .setColor('#40ff00')
            .setTitle('SUCCESS')
            .setDescription(`You've successfully accepted the invitation and received access to your clan area.`);

        const declineEmbed = new Discord.RichEmbed()
            .setColor('#ff0000')
            .setTitle('SUCCESS')
            .setDescription(`You've successfully declined the invitation and will not receive access to the clan area.`);

        mentionedUser.send(inviteEmbed).then(embedMessage => {
            embedMessage.react('✅').then(() => embedMessage.react('❌'));
            message.channel.send(`You've successfully invited **${mentionedUser.username}**. He received a DM where he can **accept** or **decline** your clan invitation.`);

            const filter = (reaction, user) => {
                return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            embedMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '✅') {
                        // give role to reacted user
                        mentionedUser.send(acceptEmbed);
                    } else {
                       mentionedUser.send(declineEmbed);
                    }
                })
                .catch(collected => {
                    message.channel.send('you reacted with neither a thumbs up, nor a thumbs down.');
                });
        });
    }
};
