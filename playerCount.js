const fetch = require('node-fetch');

const getCurrentPlayers = async (message, playerCount) => {

    let playerPeakData = await playerCount.findOne({
        where: { id: 1 },
    });
    let playerPeak = JSON.parse(JSON.stringify(playerPeakData));
    let currentPlayers = 0;

    try {
        fetch('https://api.blobwar.io/v1/servers')
            .then((response) => response.json())
            .then((data) => {
                const gamemodes = Object.values(data);
                for (let i = 0; i < gamemodes.length; i++) {
                    for (let j = 0; j < gamemodes[i].length; j++) {
                        currentPlayers += gamemodes[i][j].players.current;
                    }
                }
                console.log(currentPlayers);
            });
    } catch (e) {
        console.log('Could not fetch\n' + e);
    }

    if (currentPlayers > playerPeak.playerPeak) {
        await playerCount.update(
            {
                playerPeak: currentPlayers,
            },
            {
                where: { id: 1 },
            },
        );

        playerPeakData = await playerCount.findOne({
            where: { id: 1 },
        });

        playerPeak = JSON.parse(JSON.stringify(playerPeakData));

        console.log('Updated Peak', playerPeak.playerPeak);
    }

    await message.guild.channels
        .find((channel) => channel.id === '678671710006018089')
        .setName(`Playing: ${currentPlayers} | Peak: ${playerPeak.playerPeak}`);

    console.log('PlayerCount updated');
};

module.exports = {
    getCurrentPlayers,
};
