const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

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
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
        return message.channel.send(`Unknown command. Use ${prefix}help to get a list of all commands.`);
    } else {
        try {
            client.commands.get(command).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

// login to Discord with your app's token
client.login(token);