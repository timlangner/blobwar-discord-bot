const Discord = require('discord.js');

module.exports = {
    name: 'verify',
    description: 'Reminds the devs to add or remove the nitro booster skin.',
    guildOnly: true,
    async execute(message, args) {
        const username = args[0];

        if (message.member.roles.has('329039170607513601')) {
            const reminderEmbed = new Discord.RichEmbed()
                .setColor('#F263E9')
                .setTitle('New Booster!')
                .setDescription(
                    `${message.author.username} has just verified his username.`,
                )
                .addField(`Username:`, username)
                .setFooter('footer');

            await message.guild.channels
                .find(c => c.id === '457836958098391070')
                .send(reminderEmbed);

            await message.channel.send('Your request has been send.');
        } else {
            return message.channel.send(
                'You need to boost the server in order to verify your account for the nitro skin.',
            );
        }
    },
};
