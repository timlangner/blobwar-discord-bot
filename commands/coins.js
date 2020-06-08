const fetch = require('node-fetch');

module.exports = {
    name: 'coins',
    description: 'Adds coins to a user',
    guildOnly: false,
    async execute(message, args) {
       
        const updateCoins = async (url = '', coins = 0) => {
            try {  
                const response = await fetch(
                    url,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            coins,
                            authorDiscordUid: message.author.id
                        }),
                    },
                );
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 403) {
                    return null;
                }
            } catch (e) {
                console.log('Could not fetch\n' + e);
            }
        }

        if (args[0] === 'add') {
            updateCoins(`https://api.blobwar.io/v1/users/coins/add/${
                        message.mentions.users.first().id
                    }`, parseInt(args[2]), message.author.id).then((res) => {
                if (res) {
                    message.channel.send(
                        `Successfully added **${res.coinsAdded} coins** to <@${
                            message.mentions.users.first().id
                        }>. He now has **${res.totalCoins} coins**!`,
                    );
                } else if (!res) {
                    message.channel.send(
                        `You have **no permissions** to use this command!`,
                    );
                }
            });
        }

        if (args[0] === 'set') {
            updateCoins(
                `https://api.blobwar.io/v1/users/coins/set/${
                    message.mentions.users.first().id
                }`,
                parseInt(args[2]),
                message.author.id,
            ).then((res) => {
                if (res) {
                    message.channel.send(
                        `Successfully set <@${
                            message.mentions.users.first().id
                        }> coins to **${res.coins}**!`,
                    );
                } else if (!res) {
                    message.channel.send(
                        `You have **no permissions** to use this command!`,
                    );
                }
            });
        }
    },
};
