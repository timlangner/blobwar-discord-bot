const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'stats',
    description: 'Shows the fanix server stats',
    guildOnly: true,
    async execute(message, args, clan, member) {
        if (!args.length) {
            return message.channel.send(`You didn't provide a server, ${message.author}!`);
        } else {
            const input = args[0];
            const response = await fetch('https://eu.fanix.io:2199/');
            const data = await response.json();

            let server;
            let servername;
            let servercount;
            let currentcount;

            for (let key in data) {
                let category = data[key];
                let i = 0;

                for (let counter in category)
                {
                    if (category.hasOwnProperty(counter)) {
                        server = category[counter];
                        server = server.split(' - ');
                        servername = server[0];
                        servercount = server[1];
                        servercount = servercount.split('/');
                        currentcount = servercount[0];

                        console.log('server', server);
                        console.log('servername', servername);
                        console.log('servercount', servercount);
                        console.log('currentcount', currentcount);
                    }
                }
            }

            switch (input) {
                case 'Ultrasplit':
                    let uData = JSON.stringify(data.Ultrasplit);
                    const uCurrentPlayers = uData.split('/');
                    const u2 = uData.replace(/,/g, '\n');
                    const u3 = u2.replace('[', '');
                    const u4 = u3.replace(']', '');
                    const uFinal = u4.replace(/"/g, '');
                    const uOwnerAvatar = (await message.client.fetchUser('185053226641522690')).avatarURL;
                    const uServerEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${args[0]}`)
                        .setURL('https://fanix.io/')
                        .setDescription(`Here are some stats about the Ultrasplit servers.`)
                        .addField('Overview', `${uFinal}`, true)
                        .addField(`Servers`, `${data.Ultrasplit.length}`, true)
                        .addField(`Total Players`, `${uCurrentPlayers}`, true)
                        .setFooter('Made with ♥ by Pake#0001', uOwnerAvatar);
                    await message.channel.send(uServerEmbed);
                    break;

                case 'Megasplit':
                    const mData = JSON.stringify(data.Megasplit);
                    const m1 = mData.replace(/,/g, '\n');
                    const m2 = m1.replace('[', '');
                    const m3 = m2.replace(']', '');
                    const mFinal = m3.replace(/"/g, '');
                    const mOwnerAvatar = (await message.client.fetchUser('185053226641522690')).avatarURL;
                    const mServerEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${args[0]}`)
                        .setURL('https://fanix.io/')
                        .setDescription(`Here are some stats about the Megasplit servers.`)
                        .addField('Overview', `${mFinal}`, true)
                        .addField(`Servers`, `${data.Megasplit.length}`, true)
                        .setFooter('Made with ♥ by Pake#0001', mOwnerAvatar);
                    await message.channel.send(mServerEmbed);
                    break;

                case 'Instant':
                    const iData = JSON.stringify(data.Instant);
                    const i1 = iData.replace(/,/g, '\n');
                    const i2 = i1.replace('[', '');
                    const i3 = i2.replace(']', '');
                    const iFinal = i3.replace(/"/g, '');
                    const iOwnerAvatar = (await message.client.fetchUser('185053226641522690')).avatarURL;
                    const iServerEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${args[0]}`)
                        .setURL('https://fanix.io/')
                        .setDescription(`Here are some stats about the Instant servers.`)
                        .addField('Overview', `${iFinal}`, true)
                        .addField(`Servers`, `${data.Megasplit.length}`, true)
                        .setFooter('Made with ♥ by Pake#0001', iOwnerAvatar);
                    await message.channel.send(iServerEmbed);
                    break;

                case 'Bots':
                    const bData = JSON.stringify(data.Bots);
                    const b1 = bData.replace(/,/g, '\n');
                    const b2 = b1.replace('[', '');
                    const b3 = b2.replace(']', '');
                    const bFinal = b3.replace(/"/g, '');
                    const bOwnerAvatar = (await message.client.fetchUser('185053226641522690')).avatarURL;
                    const bServerEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${args[0]}`)
                        .setURL('https://fanix.io/')
                        .setDescription(`Here are some stats about the Instant servers.`)
                        .addField('Overview', `${bFinal}`, true)
                        .addField(`Servers`, `${data.Megasplit.length}`, true)
                        .setFooter('Made with ♥ by Pake#0001', bOwnerAvatar);
                    await message.channel.send(bServerEmbed);
                    break;
            }
        }
    }
};
