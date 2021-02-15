import { Client, Collection, CollectorFilter, DataResolver, Message, PresenceStatusData, MessageEmbed, TextBasedChannel, ActivityType, TextChannel, GuildMember, User, Guild, MessageAttachment, FileOptions, BufferResolvable } from "discord.js"

import * as fs from "fs"

import got from "got"

type Activities = "PLAYING" | "STREAMING" | "LISTENING" | "WATCHING" | "COMPETING"

let collection: Collection<any, any> = new Collection()

import * as dotenv from "dotenv"

import * as duration from "humanize-duration"

dotenv.config()

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
                    client.on(fileName, (...args) => event(client, MessageEmbed, this, ...args))
                })
            })
        }
    }
    /**
     * This method runs the command files from the folder you specified in the constructor that if it finds your message arguments equals to the command.name or one of the aliases of the command. You can access the help command by -help
     * @param msg - The Message object
     * @param execute - If you want to execute the file
     */
    runCommand(msg: Message, execute: boolean) {
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
                    if(execute) {
                        // try {
                            let mapped_collection = collection
                            let args = this.setArgs(msg, { splitby: / +/g, noPrefix: false})
                            let command = collection.get(args[0]) || collection.find(command => command.aliases?.some(w => w === args[0]))
                            if(Array.isArray(this.prefix)) {
                                if(this.prefix.some(prefixes => msg.content.startsWith(prefixes))) {
                                    if(command && args[0].match(/[a-z]{1}/g)) {
                                        if(command.guildOnly && command.hasOwnProperty("guildOnly")) {
                                            if(msg.channel.type === "dm") return msg.author.send(`This command is only available in the server`)
                                            if(Array.isArray(command.requiredRoles) && command.hasOwnProperty("requiredRoles")) {
                                                if(msg.member.roles.cache.some(role => command.requiredRoles.includes(role.id)) || msg.member.id === msg.guild.ownerID) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            } else if(!command.hasOwnProperty("requiredRoles")) {
                                                return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                            } else {
                                                if(msg.member.roles.cache.has(command.requiredRoles)) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            }
                                        } else if(!command.hasOwnProperty("guildOnly")) {
                                            if(Array.isArray(command.requiredRoles) && command.hasOwnProperty("requiredRoles")) {
                                                if(msg.member.roles.cache.some(role => command.requiredRoles.includes(role.id)) || msg.member.id === msg.guild.ownerID) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            } else if(!command.hasOwnProperty("requiredRoles")) {
                                                return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                            } else {
                                                if(msg.member.roles.cache.has(command.requiredRoles)) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            }
                                        } else {
                                            if(Array.isArray(command.requiredRoles) && command.hasOwnProperty("requiredRoles")) {
                                                if(msg.member.roles.cache.some(role => command.requiredRoles.includes(role.id)) || msg.member.id === msg.guild.ownerID) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            } else if(!command.hasOwnProperty("requiredRoles")) {
                                                return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                            } else {
                                                if(msg.member.roles.cache.has(command.requiredRoles)) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            }
                                        }
                                    } else if(!args[0].match(/[a-z]{1}/g)) {
                                        return;
                                    } else {
                                        return msg.channel.send(`${!msg.guild ? "" : msg.author.toString() + ":"} Oops seems like the command you want to execute doesn't exist, or you specified a prefix in your text, lol`).then(message => {
                                            message.delete({timeout: 5000}).catch(() => undefined)
                                        });
                                    }
                                }
                            } else {
                                if(msg.content.startsWith(this.prefix)) {
                                    if(command && args[0].match(/[a-z]{1}/g)) {
                                        if(command.guildOnly && command.hasOwnProperty("guildOnly")) {
                                            if(!msg.guild) return msg.author.send(`This command can only be executed in the server`)
                                            if(Array.isArray(command.requiredRoles) && command.hasOwnProperty("requiredRoles")) {
                                                if(msg.member.roles.cache.some(role => command.requiredRoles.includes(role.id)) || msg.member.id === msg.guild.ownerID) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            } else if(!command.hasOwnProperty("requiredRoles")) {
                                                return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                            } else {
                                                if(msg.member.roles.cache.has(command.requiredRoles)) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            }
                                        } else if(!command.hasOwnProperty("guildOnly")) {
                                            if(Array.isArray(command.requiredRoles) && command.hasOwnProperty("requiredRoles")) {
                                                if(msg.member.roles.cache.some(role => command.requiredRoles.includes(role.id)) || msg.member.id === msg.guild.ownerID) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            } else if(!command.hasOwnProperty("requiredRoles")) {
                                                return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                            } else {
                                                if(msg.member.roles.cache.has(command.requiredRoles)) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            }
                                        } else {
                                            if(Array.isArray(command.requiredRoles) && command.hasOwnProperty("requiredRoles")) {
                                                if(msg.member.roles.cache.some(role => command.requiredRoles.includes(role.id)) || msg.member.id === msg.guild.ownerID) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            } else if(!command.hasOwnProperty("requiredRoles")) {
                                                return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                            } else {
                                                if(msg.member.roles.cache.has(command.requiredRoles) || msg.member.id === msg.guild.ownerID) {
                                                    return command.execute(msg, args, MessageEmbed, this, mapped_collection)
                                                } else {
                                                    return this.messageSend(msg, `<@${msg.author.id}>: Seems like you don't have permission to run this command`, { delete: true, botMessageDelete: true, timeout: 5000})
                                                }
                                            }
                                        }
                                    } else if(!args[0].match(/[a-z]{1}/g)) {
                                        return
                                    } else {
                                        return msg.channel.send(`${!msg.guild ? "" : msg.author.toString() + ":"} Oops seems like the command you want to execute doesn't exist, or you specified a prefix in your text, lol`).then(message => {
                                            message.delete({timeout: 5000}).catch(() => undefined)
                                        });
                                    }
                                }
                            }
                        // } catch (err) {
                        //     return msg.channel.send(`<@${msg.author.id}>: Seems like the command you are trying to execute has no execute function, or there is an error on the handler, might take awhile for the dev to fix this`)
                        // }
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
    setArgs(msg: Message, options: {splitby: string | RegExp, noPrefix: boolean}) {
        if(!Array.isArray(this.prefix)) {
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
        } else {
            if(!options.noPrefix) {
                if(options.splitby) {
                    return msg.content.slice(1).trim().split(options.splitby)
                } else {
                    return msg.content.slice(1).trim()
                }
            } else {
                if(options.splitby) {
                    return msg.content.split(options.splitby)
                }
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
     * @param options - options for you message send
     */
    messageSend(msg: Message, message: string, options: { dm?: boolean, delete?: boolean, botMessageDelete?: boolean, timeout?: number, picture?: string[]}) {
        if(!options) throw new Error("Please specify an option")
        if(options.dm) return msg.author.send(message)
        if(typeof options.delete !== "boolean") throw new TypeError("options.delete must be a boolean")
        if(typeof options.botMessageDelete !== "boolean") throw new TypeError("options.botMessageDelete must be a boolean")
        if(options) {
            options.delete ? msg.delete() : ""
            options.botMessageDelete ? msg.channel.send(message, {files: options.picture}).then(message => message.delete({timeout: typeof options.timeout === "number" ? options.timeout : 5000})) : msg.channel.send(message, {files: options.picture})
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
                return msg.channel.clone({name: msg.channel.name, type: msg.channel.type, topic: msg.channel.topic, parent: msg.channel.parentID}).then(channel => {
                    channel.delete()
                    channel.send(`<@${msg.member.id}>: You've nuked the last channel so I cloned it and created a new one`)
                })
            } else {
                if(msg.guild.me.hasPermission("MANAGE_MESSAGES")) {
                    if(count >= 1 && count <= 100 && !isNaN(count)) {
                        await msg.delete()
                        msg.channel.bulkDelete(count).then(message => {
                            if(message.size <= 1) {
                                this.messageSend(msg, `Deleted ${message.size} message`, { delete: false, botMessageDelete: true, timeout: 5000})
                            } else {
                                this.messageSend(msg, `Deleted ${message.size} messages`, { delete: false, botMessageDelete: true, timeout: 5000})
                            }
                        })
                    } else if(isNaN(count)) {
                        this.messageSend(msg, `<@${msg.member.id}>: You specified a Not a Number value`, { delete: true, botMessageDelete: true, timeout: 5000})
                    } else if(count > 100) {
                        this.messageSend(msg, `<@${msg.member.id}>: You cannot delete that much messages`, { delete: true, botMessageDelete: true, timeout: 5000})
                    } else {
                        this.messageSend(msg, `<@${msg.member.id}>: The delete count cannot be less than 1`, { delete: false, botMessageDelete: true, timeout: 5000})
                    }
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
     * A time converter
     * @param time - The date time you want to convert
     */
    timeConverter(time: number) {
        if(!time) throw new Error("Please specify a time and make sure it is type number")
        let overallAge = duration(time - Date.now(), { units: ["y", "mo", "d", "h", "m", "s"], round: true, conjunction: " and "})
        return Date.now() - time <= 20000 ? "A moment ago" : Date.now() - time <= 12000000 ? "A minute ago" : Date.now() - time <= 7200000 ? "An hour ago" : Date.now() - time <= 86400000 ? "A day ago" : Date.now() - time <= 604800000 ? "A week ago" : Date.now() - time <= 2629746000 ? "A month ago" : Date.now() - time <= 63113904000 ? "A Year ago" : overallAge
    }
}