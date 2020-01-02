const Discord = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Shows the info of a clan',
    guildOnly: true,
    async execute(message, args, clan, member) {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        } else {
            let clanName = args;
            let clanExists = false;
            const members = [];
            const memberUserObjects = [];
            let fullClanName = clanName.join(',').replace(/,/g, ' ').split();
            const finalClanName = fullClanName.toString().toLowerCase();

            const clanData = await clan.findOne({where: {name: finalClanName}});
            const clanInfo = JSON.parse(JSON.stringify(clanData));

            let memberClanData = null;
            let memberClan = null;

            if (clanInfo) {
                clanExists = true;
                memberClanData = await member.findAll({where: {clanName: clanInfo.name}});
                memberClan = JSON.parse(JSON.stringify(memberClanData));
            } else {
                return message.channel.send(`Could't find a clan with the name: **${fullClanName}**`)
            }

            for (let i=0; i < memberClan.length; i++) {
                await members.push(message.guild.members.find(member => member.user.id === memberClan[i].memberUserId).user);
            }
            const clanOwner = await members[0];

            // Removes the owner from the member array
            members.shift();

            // Format CreationDate
            const date = new Date(clanInfo.createdAt);

            const infoEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle(`${finalClanName}`)
                .setURL('https://fanix.io/')
                .setDescription(`Here's some information about the clan **${fullClanName}**!`)
                .addField('Owner', `${clanOwner}`)
                .addField('Members:', `${members.map(m => m.toString())}`)
                .setFooter(`Creation date: ${date.toUTCString()}`);
                return message.channel.send(infoEmbed);

        }
    }
};
