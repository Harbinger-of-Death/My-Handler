let Discord = require("discord.js")

let client = new Discord.Client()

let commandHandler = require("./handler.js")

let handler = new commandHandler(client)

let prefix = handler.setPrefix("!")

client.on("message", msg => {
    if(msg.author.bot) return;
    if(msg.content.startsWith(`${prefix}hello`)) {
        msg.channel.send("Hi")
    }
})

client.on("ready", () => {
    console.log(`Bot ${client.user.username} is ready`)
})