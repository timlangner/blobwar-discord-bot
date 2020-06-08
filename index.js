const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { prefix, token } = require('./config.json');
const getPlayerCount = require('./playerCount.js');

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Database connection information
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

// Create "PlayerCount" table
const playerCount = sequelize.define('playerCount', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
    },
    playerPeak: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0,
        allowNull: false,
    },
});

// Find all commands
const commandFiles = fs
    .readdirSync('./commands/clan')
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/clan/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', async () => {
    console.log('Ready!');

    // set playing status
    await client.user.setActivity('Fanix.io');

    // sync the tables
    playerCount.sync();
});

client.on('message', message => {
    message.channel.send('Successfully started the Player Count updater!');
    setInterval(() => {
        getPlayerCount.getCurrentPlayers(message, playerCount);
    }, 30000);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
        return message.channel.send(
            `Unknown command. Use **${prefix}help** to get a list of all commands.`,
        );
    } else {
        try {
            client.commands.get(command).execute(message, args, clan, member);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

// login to Discord with your app's token
client.login(token);
