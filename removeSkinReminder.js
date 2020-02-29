const Discord = require('discord.js');

const sendRemoveReminder = async member => {
    const reminderEmbed = new Discord.RichEmbed()
        .setColor('#8C0B0D')
        .setTitle('We lost a booster!')
        .setDescription(
            `${member.username} is not boosting the server anymore.`,
        )
        .addField(`Username:`, member.username)
        .setFooter('footer');

    await member.guild.channels
        .find(c => c.id === '457836958098391070')
        .send(reminderEmbed);
};

module.exports = {
    sendRemoveReminder,
};
