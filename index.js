const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const {prefix, token} = require('./config.json');

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Database connection information
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: true,
    // SQLite only
    storage: 'database.sqlite',
});

// Create "Clan" table
const clan = sequelize.define('clan', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        defaultValue: "",
        allowNull: false,
    },
    ownerUserId: {
        type: Sequelize.INTEGER,
        unique: true,
        defaultValue: 0,
        allowNull: false,
    },
    memberCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

// Find all commands
const commandFiles = fs.readdirSync('./commands/clan').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/clan/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');

    // set playing status
    client.user.setActivity('Fanix.io');

    // sync the clan table
    clan.sync();
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
        return message.channel.send(`Unknown command. Use ${prefix}help to get a list of all commands.`);
    } else {
        try {
            client.commands.get(command).execute(message, args, clan);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

// login to Discord with your app's token
client.login(token);