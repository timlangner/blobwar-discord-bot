const fetch = require('node-fetch');

const getCurrentPlayers = async (message, playerCount) => {
    const ips = [
        'http://eu.fanix.io:5751/',
        'http://eu.fanix.io:5752/',
        'http://eu.fanix.io:5951/',
        'http://eu.fanix.io:5952/',
        'http://eu.fanix.io:5551/',
        'http://eu.fanix.io:5552/',
        'http://eu.fanix.io:5651/',
        'http://eu.fanix.io:5652/',
        'http://eu.fanix.io:5451/',
        'http://eu.fanix.io:5452/',
        'http://eu.fanix.io:5251/',
        'http://na.fanix.io:5751/',
        'http://na.fanix.io:5551/',
        'http://na.fanix.io:5552/',
        'http://na.fanix.io:5651/',
        'http://na.fanix.io:5652/',
        'http://na.fanix.io:5451/',
        'http://na.fanix.io:5452/',
    ];

    let playerPeakData = await playerCount.findOne({
        where: { id: 1 },
    });
    let playerPeak = JSON.parse(JSON.stringify(playerPeakData));
    let currentPlayers = 0;

    for (let i = 0; i < ips.length; i++) {
        try {
            const response = await fetch(ips[i]);
            const stats = await response.json();
            currentPlayers += stats.current_players;
        } catch (e) {
            console.log('Could not fetch\n' + e);
        }
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
        .find(channel => channel.id === '678671710006018089')
        .setName(`Playing: ${currentPlayers} | Peak: ${playerPeak.playerPeak}`);

    console.log('PlayerCount updated');
};

module.exports = {
    getCurrentPlayers,
};
