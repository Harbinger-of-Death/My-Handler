import { Client, Collection, CollectorFilter, DataResolver, Message, PresenceStatusData, MessageEmbed, TextBasedChannel, ActivityType, TextChannel, GuildMember, User, Guild, MessageAttachment, FileOptions, BufferResolvable, DiscordAPIError } from "discord.js"

import * as fs from "fs"

import got from "got"

type Activities = "PLAYING" | "STREAMING" | "LISTENING" | "WATCHING" | "COMPETING"

type MongoDBName = "Afk" | "Economy" | "Muted" | "Muted" | "Ticket" | "Warn"
type MongoDBCollections = "Afk_people" | "giveaways" | "somethinhg" | "Muted_members" | "Tickets" | "warned_people"

let collection: Collection<any, any> = new Collection()

import * as dotenv from "dotenv"

import * as duration from "humanize-duration"
let count = 0
dotenv.config()

import * as mongoose from "mongodb"
import { resolveProjectReferencePath } from "typescript"
import { Db } from "mongodb"

import handler from "./handler"
import col from "./collectionHandler"

let MyCollection = new col()
/// <reference path="./Typings/index.d.ts"/>
export default class Handler {
    public prefix: string | string[]
    public commandDir: string
    public commandFiletype: string
    public client: Client
    public default_prefix: string
    /**
     * Constructor to login to your bot
     * @param client - The client variable
     * @param prefix - Your prefix
     * @param commandDir - The path to your command file
     * @param commandFiletype - The filetype you want to only look in your command file
     */
    constructor(
        client: Client, prefix: string | string[], commandDir?: string, commandFiletype?: string, eventFile?: string) {
        if(!client) {
            throw new Error("Please initiate a client")
        } else {
            this.client = client
        }
        if(!process.env.TOKEN) {
            throw new Error("Please make sure you have made an environment variable for your token.")
        } else {
            client.login(process.env.TOKEN)
        }
        if(!prefix) {
            this.default_prefix = "-"
        } else {
            this.prefix = prefix
        }
        if(commandDir) {
            if(commandFiletype) {
                this.commandDir = commandDir
                this.commandFiletype = commandFiletype
            }
        }
        if(eventFile) {
            fs.readdir(eventFile, (err, file) => {
                file.filter(file => file.endsWith(".js")).forEach(files => {
                    let fileName = files.split(".")[0]
                    let event = require(`./events/${fileName}`)
                    client.on(fileName, (...args) => event(client, MessageEmbed, MyCollection ,this, ...args))
                })
            })
        }
    }
    /**
     * This method runs the command files from the folder you specified in the constructor that if it finds your message arguments equals to the command.name or one of the aliases of the command. You can access the help command by -help
     * @param msg - The Message object
     * @param execute - If you want to execute the file
     */
    runCommand(msg: Message) {
        if(typeof this.commandDir !== "string") {
            throw new TypeError("option command must be type string")
        } else {
            if(fs.statSync(this.commandDir).isDirectory()) {
                if(this.commandFiletype) {
                    let default_filetype: string = ".js"
                    let commandFolder = fs.readdirSync(this.commandDir).filter(w => w.endsWith(!this.commandFiletype ? default_filetype : this.commandFiletype))
                    for(let file of commandFolder) {
                        let command = require(`${this.commandDir}/${file}`)
                        collection.set(command.name, command)
                    }
                    let mapped_collection = collection
                    let args = this.setArgs(msg, { splitby: / +/g})
                    let command = collection.get(args[0]) || collection.find(command => command.aliases?.some(alias => alias === args[0]))
                    if(Array.isArray(this.prefix)) {
                        if(this.prefix.some(w => msg.content.startsWith(w))) {
                            if(command && /[a-zA-Z]{1}/gim.test(args[0])) {
                                if(command.disable && command.hasOwnProperty("disable")) return this.messageSend(msg, {
                                    embed: {
                                        title: "Command Disabled",
                                        description: `${msg.author.toString()}: Unfortunately the owner of this bot disabled this command`,
                                        color: "#FF0000"
                                    }
                                }, { botMessageDelete: true, timeout: 5000 })
                                if(command.guildOnly && command.hasOwnProperty("guildOnly") && msg.channel.type === "dm") return this.messageSend(msg, {
                                    embed: {
                                        title: "Guild Only",
                                        description: `${msg.author.toString()}: This command is only available in the server`,
                                        color: "FF0000"
                                    }
                                }, { dm: true})
                                if(command?.requiredRoles && command.hasOwnProperty("requiredRoles") && msg.guild) {
                                    if(msg.member.roles.cache.some(role => command.requiredRoles.includes(role.id)) || msg.author.id === "576894343122649098") {
                                        command.execute(msg, args, this, mapped_collection, MyCollection)
                                    } else {
                                        this.messageSend(msg, {
                                            embed: {
                                                title: "Roles Required",
                                                description: `${msg.author.toString()}: You don't have permission to run this command`,
                                                color: "#FF0000"
                                            }
                                        }, { delete: true, botMessageDelete: true, timeout: 5000})
                                    }
                                } else if(!command?.requiredRoles) {
                                    command.execute(msg, args, this, mapped_collection, MyCollection)
                                } else {
                                    if(msg.channel.type === "dm") {
                                        command.execute(msg, args, this, mapped_collection, MyCollection)
                                    }
                                }
                            }
                        }
                    } else {
                        if(msg.content.startsWith(this.prefix)) {
                            if(command.disable && command.hasOwnProperty("disable")) return this.messageSend(msg, {
                                embed: {
                                    title: "Command Disabled",
                                    description: `${msg.author.toString()}: Unfortunately the owner of this bot disabled this command`,
                                    color: "#FF0000"
                                }
                            }, { botMessageDelete: true, timeout: 5000 })
                            if(command && /[a-zA-Z]{1}/gim.test(args[0])) {
                                if(command?.guildOnly && command.hasOwnProperty("guildOnly") && msg.channel.type === "dm") return this.messageSend(msg, {
                                    embed: {
                                        title: "Guild Only",
                                        description: `${msg.author.toString()}: This command is only available in the server`,
                                        color: "FF0000"
                                    }
                                }, { dm: true})
                                if(command?.requiredRoles && command.hasOwnProperty("requiredRoles") && msg.guild) {
                                    if(msg.member.roles.cache.some(role => command.requiredRoles.includes(role.id)) || msg.author.id === "576894343122649098") {
                                        command.execute(msg, args, this, mapped_collection, MyCollection)
                                    } else {
                                        this.messageSend(msg, {
                                            embed: {
                                                title: "Roles Required",
                                                description: `${msg.author.toString()}: You don't have permission to run this command`,
                                                color: "#FF0000"
                                            }
                                        }, { delete: true, botMessageDelete: true, timeout: 5000})
                                    }
                                } else if(!command?.requiredRoles) {
                                    command.execute(msg, args, this, mapped_collection, MyCollection)
                                } else {
                                    if(msg.channel.type === "dm") {
                                        command.execute(msg, args, this, mapped_collection, MyCollection)
                                    }
                                }
                            } 
                        }
                    }
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
    setArgs(msg: Message, options?: {splitby: string | RegExp}) {
        if(!options) return msg.content
        return options.splitby ? msg.content.slice(1).split(options.splitby) : msg.content.slice(1)
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
        if(!msg.guild) throw new Error("Seems like the collector is done inside a DM")
        if(Array.isArray(reactions) && typeof reactions !== "number") {
            for (let emojis of reactions) {
                msg.react(emojis)
            }
            let filters: CollectorFilter; 
            if(filter === "everyone" || filter === "") {
                filters = (reaction, user) => reactions.some(w => w === reaction.emoji.name || reaction.emoji.id) && !user.bot
            } else {
                filters = (reaction, user) => reactions.some(w => w === reaction.emoji.name || reaction.emoji.id) && !user.bot && user.id === filter
            }
            return msg.awaitReactions(filters, collectorOptions)
        } else if(typeof reactions === "number") {
            throw new TypeError("Please make sure you didn't put a number for reactions")
        } else {
            let filters: CollectorFilter = (reaction, user) => reaction.emoji.name === reactions && !user.bot && user.id === filter
            msg.react(reactions)
            return msg.awaitReactions(filters, collectorOptions)
        }
    }
    /**
     * Simple function for sending a message in discord
     * @param msg - The Message object
     * @param message - The message you want to send
     * @param options - The options for your message. 
     */
    messageSend(msg: Message, message: string | MessageEmbed | any, options?: { channelID?: string, dm?: boolean, delete?: boolean, botMessageDelete?: boolean, timeout?: number, picture?: any}) {
        if(!message) throw new Error("You must input a message")
        if(options) {
            if(options.dm) return msg.author.send(message)
            if(typeof options.channelID === "string" && /\d{17,18}/gim.test(options.channelID) && options.channelID) {
                options.delete ? msg.delete() : null
                let channel = <TextChannel>msg.client.channels.cache.get(options.channelID)
                channel.send(message, options.picture ? { files: options.picture} :  null).then(m => {
                    if(options.botMessageDelete) {
                        setTimeout(() => {
                            m.delete()
                        }, options.timeout && typeof options.timeout === "number" ? options.timeout : 5000)
                    }
                })
            } else if(!/\d{17,18}/gim.test(options.channelID) && options.channelID) {
                throw new Error("Channel ID must be 17,18 in length and it must be a snowflake")
            } else if(typeof options.channelID !== "string" && options.channelID){
                throw new TypeError("options.channelID must be type string")
            } else {
                options.delete ? msg.delete() : null
                msg.channel.send(message, options.picture ? {files: options.picture} : null).then(m => {
                    if(options.botMessageDelete) {
                        setTimeout(() => {
                            m.delete()
                        }, options.timeout && typeof options.timeout === "number" ? options.timeout : 5000)
                    }
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
     * This function set the status of your bot to whatever you want. Must be used inside a ready event.
     * @param activity - Whether you want an activity or not.
     * @param statusMessage - The message you want your bot to show in their status, or the url to your twitch if type is equals to 1 or STREAMING
     * @param statusType - The activity type
     * @param status - If you want your bot to show as online, dnd, offline.
     * @returns Sets your bot Presence.
     */
    setStatus(activity: boolean, statusMessage: string, statusType: number | Activities, status?: PresenceStatusData) {
        MyCollection.set("Bot_uptime", Date.now())
        if(activity) {
            if(statusMessage) {
                if(statusType === 1 || statusType === "STREAMING") {
                    return this.client.user.setPresence({
                        activity: {
                            url: statusMessage,
                            type: "STREAMING"
                        },
                        status: status
                    })
                } else {
                    return this.client.user.setPresence({
                        activity: {
                            name: statusMessage,
                            type: statusType
                        },
                        status: status
                    })
                }
            } else {
                return this.client.user.setPresence({
                    activity: {
                        name: "Seems like you don't have status set in",
                        type: "PLAYING"
                    },
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
    /**
     * A method to automatically do clean command for you with some options
     * @param msg - The message object
     * @param count - The count of how many messages you want to be deleted
     * @param options - The options, if nuke is set to true it will clone the channel with the same stuff as the old one, I do this to prevent API spam
     */
    async cleanCommand(msg: Message, count: number, options: { nuke: boolean}) {
        if(!msg) throw new Error("Please specify something in the channel parameter")
        if(msg.channel.type === "text") {
            if(options.nuke) {
                if(msg.author.id !== "576894343122649098") return this.messageSend(msg, {
                    embed: {
                        title: "Nuke",
                        description: `<@${msg.author}>: Only the owner can nuke`,
                        color: "#FF0000"
                    }
                }, { delete: true, botMessageDelete: true, timeout: 5000})
                return msg.channel.clone().then(channel => {
                    msg.channel.delete()
                    this.messageSend(msg, {
                        embed: {
                            title: "Nuked!",
                            description: `<@${msg.member.id}>: You've nuked the last channel so I cloned it and created a new one`,
                            color: "#00FFFF"
                        }
                    }, { channelID: channel.id})
                })
            } else {
                if(msg.guild.me.permissions.has("MANAGE_MESSAGES")) {
                    if(count.toString() === "--nuke") return;
                    if(/[^\d]/gim.test(count.toString())) return this.messageSend(msg, {
                        embed: {
                            title: "Argument Error",
                            description: `<@${msg.author.id}>: Please provide a number`,
                            color: "#FF0000"
                        }
                    }, { delete: true, botMessageDelete: true, timeout: 5000})
                    if(count > 100) return this.messageSend(msg, {
                        embed: {
                            title: "RangeError",
                            description: `<@${msg.author.id}>: Count must be less than 100`,
                            color: "#FF0000"
                        }
                    }, { delete: true, botMessageDelete: true, timeout: 5000})
                    await msg.delete().catch(() => undefined)
                    msg.channel.bulkDelete(count, true).then(message => {
                        if(message.size <= 1) {
                            this.messageSend(msg, {
                                embed: {
                                    title: "Clean",
                                    description: `Deleted ${message.size} message`,
                                    color: "#00FFFF"
                                }
                            }, { delete: false, botMessageDelete: true, timeout: 5000})
                        } else {
                            this.messageSend(msg, {
                                embed: {
                                    title: "Clean",
                                    description: `Deleted ${message.size} messages`,
                                    color: "#00FFFF"
                                }
                            }, { delete: false, botMessageDelete: true, timeout: 5000})
                        }
                    })
                } else {
                    return msg.channel.send(`${msg.author}: Seems like I don't have permission to do this command`)
                }
            }
        }
    }
    fetcher(msg: Message, user: boolean, id: string): Promise<GuildMember> | Promise<User> {
        if(!msg) throw new Error("No msg parameter specified")
        if(!id) throw new Error("Please specify an ID to fetch")
        if(user) {
            return msg.client.users.fetch(id)
        } else {
            return msg.guild.members.fetch(id)
        }
    }
    /**
     * A simple epoch converter
     * @param time - The epoch timestamp you want to convert
     * @returns string
     */
    epochConverter(time: number, boost?: boolean) {
        if(!time) throw new Error("Please specify a time and make sure it is type number")
        let date = Math.abs(Date.now() - time)
        let years = Math.floor(date / 1000 / 60 / 60 / 24 / 365.2425)
        let months = Math.floor(date / 1000 / 60 / 60 / 24 / 30)
        let weeks = Math.floor(date / 1000 / 60 / 60 / 24 / 7)
        let days = Math.floor(date / 1000 / 60 / 60 / 24)
        let hours = Math.floor(date / 1000 / 60 / 60)
        let minutes = Math.floor(date / 1000 / 60)
        let seconds = Math.floor(date / 1000)
        if(!boost) {
            if(date >= 0 && date <= 20000) {
                return `${Date.now() < time ? "In a moment" : "A moment ago"}`  
            } else if(date >= 1000 * 60 * 1 && date <= 1000 * 60 * 2) {
                return `${Date.now() < time ? "In a minute" : "A minute ago"}`  
            } else if(date >= 1000 * 60 * 60 * 1 && date <= 1000 * 60 * 60 * 2) {
                return `${Date.now() < time ? "In an hour" : "An hour ago"}`  
            } else if(date >= 1000 * 60 * 60 * 24 * 7 && date <= 1000 * 60 * 60 * 24 * 14) {
                return `${Date.now() < time ? "In a week" : "A week ago"}`
            } else {
                return `${Date.now() < time ? "In " : ""}${years >= 1 ? `${years} year${years <= 1 ? "" : "s"}` : ""}${months >= 1 && months <= 12 ? `${months} month${months <= 1 ? "" : "s"}` : ""}${weeks >= 1 && weeks <= 4 ? `${weeks} week${weeks <= 1 ? `` : "s"}` : ""}${days >= 1 && days <= 7 ? `${days} day${days <= 1 ? "" : "s"}` : ""}${hours >= 1 && hours <= 24 ? `${hours} hour${hours <= 1 ? "" : "s"}` : ""}${minutes >= 1 && minutes <= 60 ? `${minutes} minute${minutes <= 1 ? "" : "s"}` : ""}${seconds >= 1 && seconds <= 60 ? `${seconds} second${seconds <= 1 ? `` : "s"}` : ""}${Date.now() > time ? " ago" : ""}`
            }
        } else {
            return `For ${years >= 1 ? `${years} year${years <= 1 ? "" : "s"}` : ""}${months >= 1 && months <= 12 ? `${months} month${months <= 1 ? "" : "s"}` : ""}${weeks >= 1 && weeks <= 4 ? `${weeks} week${weeks <= 1 ? `` : "s"}` : ""}${days >= 1 && days <= 7 ? `${days} day${days <= 1 ? "" : "s"}` : ""}${hours >= 1 && hours <= 24 ? `${hours} hour${hours <= 1 ? "" : "s"}` : ""}${minutes >= 1 && minutes <= 60 ? `${minutes} minute${minutes <= 1 ? "" : "s"}` : ""}${seconds >= 1 && seconds <= 60 ? `${seconds} second${seconds <= 1 ? `` : "s"}` : ""}`
        }
    }
    /**
     * A method to start a Mongo connection, used to store data to database
     * @param mongoDB - The database Name
     * @param mongoCollection - The collection name that is in the database
     * @returns mongoDB
     */
    async startMongo(mongoDB: MongoDBName, mongoCollection: MongoDBCollections): Promise<mongoose.Collection<any>> {
        if(!process.env.MONGOPATH) throw new Error("You didn't specify a environment var for mongo")
        if(!mongoDB) throw new Error("Please make sure you specify a database name")
        return new Promise(async (res, rej) => {
                let database: mongoose.Db
                mongoose.connect(process.env.MONGOPATH, { useUnifiedTopology: true, useNewUrlParser: true, maxIdleTimeMS: 3500}, async (err, db) => {
                    if(err) rej("There's an error")
                    try {
                        database = db.db(mongoDB)
                        res(database.collection(mongoCollection))
                        if(count === 0) {
                            count++
                            console.log("Connected Successfully")
                        }
                    } catch (err) {
                        console.log(`There's an err ${err}`)
                    } finally {
                        setTimeout(async () => {
                            await db.close()
                            console.log("DB has been closed")
                            count = 0
                        }, 1000 * 60 * 2)
                    }
                })
        })
    }
}