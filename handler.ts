import { Client, Collection, CollectorFilter, DataResolver, Message, PresenceStatusData, MessageEmbed } from "discord.js"

import * as fs from "fs"

import got from "got"

class Handler {
    public prefix: string
    /**
     * Constructor to login to your bot
     * @param client - The client variable
     * @param prefix - Your prefix
     * @param status - The status you want
     * @param message - The message for your status
     */
    constructor(
        client: Client, prefix: string) {
        if(!client) {
            throw new Error("Please initiate a client")
        }
        if(!process.env.TOKEN) {
            throw new Error("Please make sure you have made an environment variable for your token, if you do u can type require(\"dotenv\").config() on ur index")
        } else {
            client.login(process.env.TOKEN)
        }
        if(!prefix) {
            throw new Error("Please specify a prefix you want to use")
        } else {
            this.prefix = prefix
        }
    }
    /**
     * This method sets your command folder to the one you specified in option.command parameter
     * @property option.command - The command dir where you want your bot to check files
     * @property option.filetype - The filetype you want your bot to check specifically. Default is .js
     */
    runCommand(options: { command: string, filetype: string}) {
        if(typeof options.command !== "string") {
            throw new TypeError("option command must be type string")
        } else {
            if(fs.statSync(options.command).isDirectory()) {
                if(options.filetype) {
                    let default_filetype: string = ".js"
                    let collection = new Collection()
                    let commandFolder = fs.readdirSync(options.command).filter(w => w.endsWith(!options.filetype ? default_filetype : options.filetype))
                    for(let file of commandFolder) {
                        let command = require(`${options.command}/${file}`)
                        collection.set(command.name, command)
                    }
                    return collection
                } 
            } else {
                throw new Error("The directory you provided is not a directory")
            }
        }
    }
    /**
     * Does args automatically for u
     * @param msg - The message object
     * @param options - The options for your args
     * @returns
     */
    setArgs(msg: Message, options: {splitby: string, noPrefix: boolean}) {
        if(!options.noPrefix) {
            if(options.splitby) {
                return msg.content.replace(new RegExp(`^[${this.prefix}]`), "").split(options.splitby)
            } else {
                return msg.content.replace(new RegExp(`^[${this.prefix}]`), "")
            }
        } else {
            if(options.splitby) {
                return msg.content.split(options.splitby)
            }
        }
    }
    /**
     * Math command
     * @param math - The first number
     * @param math1 - The second number
     * @param options.operations - The operation you want to do
     */
    mathCommand(math: number, math1: number, options: { operations: string }) {
        if(options.operations === "multiplication") {
            if(!isNaN(math) && !isNaN(math1)) {
                return math * math1
            } else {
                console.log("I cannot multiply non-numbers")
            }
        } else if(options.operations === "division") {
            if(!isNaN(math) && !isNaN(math1)) {
                return math / math1
            } else {
                console.log("I cannot multiply non-numbers")
            }
        } else if(options.operations === "subtraction") {
            if(!isNaN(math) && !isNaN(math1)) {
                return math - math1
            } else {
                console.log("I cannot multiply non-numbers")
            }
        } else if(options.operations === "addition") {
            if(!isNaN(math) && !isNaN(math1)) {
                return math + math1
            } else {
                console.log("I cannot multiply non-numbers")
            }
        }
    }
    /**
     * This is a reaction collector
     * @param msg - The message object
     * @param reactions - Reactions you want the bot to react to your message
     * @param filter - The filter. Writing "everyone" will accept everyone reactions, else won't
     * @param collectorOptions - The options for the collector
     * @returns
     */
    reactionCollector(msg: Message, reactions: string | string[], filter: any, collectorOptions: {time: number}) {
        if(Array.isArray(reactions) && typeof reactions !== "number") {
            for (let emojis of reactions) {
                msg.react(emojis)
            }
            let filters: CollectorFilter; 
            if(filter === "everyone" || filter === "") {
                filters = (reaction, user) => reactions.some(w => w === reaction.emoji.name || reaction.emoji.id) && !user.bot
            } else {
                filters = (reaction, user) => reactions.some(w => w === reaction.emoji.name || reaction.emoji.id) && user.id === filter
            }
            return msg.awaitReactions(filters, collectorOptions)
        } else if(typeof reactions === "number") {
            throw new TypeError("Please make sure you didn't put a number for reactions")
        } else {
            let filters: CollectorFilter = (reaction, user) => reaction.emoji.name === reactions && user.id === filter
            msg.react(reactions)
            return msg.awaitReactions(filters, collectorOptions)
        }
    }
    /**
     * Simple function for sending a message in discord
     * @param msg - The Message object
     * @param message - The message you want to send
     * @param options - options for you message send
     */
    messageSend(msg: Message, message: string, options: { delete: boolean, botMessageDelete: boolean, timeout: number}) {
        if(typeof options.delete !== "boolean") throw new TypeError("options.delete must be a boolean")
        if(typeof options.botMessageDelete !== "boolean") throw new TypeError("options.botMessageDelete must be a boolean")
        if(options.botMessageDelete && options.delete) {
            if(typeof options.timeout === "number") {
                msg.delete()
                msg.channel.send(message).then(m => {
                    m.delete({timeout: options.timeout}).catch(() => undefined)
                })
            } else {
                msg.delete()
                msg.channel.send(message).then(m => {
                    m.delete({timeout: 5000}).catch(() => undefined)
                })
            }
        } else if(!options.botMessageDelete && options.delete) {
            msg.delete()
            msg.channel.send(message)
        } else if(!options.delete && options.botMessageDelete) {
            if(typeof options.timeout === "number") {
                msg.channel.send(message).then(m => {
                    m.delete({timeout: options.timeout}).catch(() => undefined)
                })
            } else {
                msg.channel.send(message).then(m => {
                    m.delete({timeout: 5000}).catch(() => undefined)
                })
            }
        } else {
            msg.channel.send(message)
        }
    }
    /**
     * Randomizes responses for you automatically
     * @param msg - The message object
     * @param response - Thw response(s) you want your bot to send in a random matter
     * @returns randomized strings
     */
    responseRandomizer(msg: Message, response: string | string[]) {
        if(Array.isArray(response)) {
            return msg.channel.send(response[Math.floor(Math.random() * response.length)])
        } else {
            return msg.channel.send(response)
        }
    }
    /**
     * This function set the status of your bot to whatever you want
     * @param client - The Client
     * @param activity - Whether you want an activity or not.
     * @param statusMessage - The message you want your bot to show in their status, or the url to your twitch if type is equals to 1
     * @param statusType - The activity type
     * @param status - If you want your bot to show as online, dnd, offline.
     * @returns Sets your bot Presence.
     */
    setStatus(client: Client, activity: boolean, statusMessage: string, statusType: number, status: PresenceStatusData) {
        if(!client) throw new Error("Please make sure you specified a client")
        if(activity) {
            if(statusMessage) {
                if(statusType === 1) {
                    return client.user.setPresence({
                        activity: {
                            url: statusMessage,
                            type: statusType
                        },
                        status: !status ? "online" : status
                    })
                } else {
                    return client.user.setPresence({
                        activity: {
                            name: statusMessage,
                            type: statusType
                        },
                        status: !status ? "online" : status
                    })
                }
            } else {
                return client.user.setPresence({
                    activity: {
                        name: "Seems like you don't have status set in",
                        type: "PLAYING"
                    },
                    status: "online"
                })
            }
        }
    }
    /**
     * This method checks the covid stat for the country you specified
     * @param msg - The message object
     * @param arg - The country you want to check the covid stats on
     * @returns
     */
    async covidStat(msg: Message, arg: string) {
        return got.get(`https://covid2019-api.herokuapp.com/v2/country/${encodeURIComponent(arg.charAt(0).toUpperCase() + arg.replace(arg.charAt(0), ""))}`).then(m => {
            const content = JSON.parse(m.body)
            const covid_embed = new MessageEmbed()
            .setTitle(content.data.location ?? "Location not Found")
            .setColor("RED")
            .setAuthor("Covid Stats", msg.guild.iconURL())
            .setThumbnail("https://images.newscientist.com/wp-content/uploads/2020/02/11165812/c0481846-wuhan_novel_coronavirus_illustration-spl.jpg")
            .addFields(
                { name: "Cases", value: content.data.confirmed ?? "Location not Found", inline: true},
                { name: "Death", value: content.data.deaths ?? "Location not Found", inline: true},
                { name: "Recovered", value: content.data.recovered ?? "Location not Found"},
                { name: "Active Cases", value: content.data.active ?? "Location not Found"}
            )
            .setFooter(`Last Updated ${content.dt}`)

            msg.channel.send(covid_embed)
        })
    }
}

export = Handler