import { Client, Collection, CollectorFilter, Message } from "discord.js"

import * as fs from "fs"

class Handler {
    public prefix: string
    /**
     * Constructor to login to your bot
     * @param client - The client variable
     * @param prefix - Your prefix
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
     * @param options - options of how should the send works
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
}

export = Handler