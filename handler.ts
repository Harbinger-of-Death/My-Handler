import { Client, Collection, Message } from "discord.js"

import * as fs from "fs"
import { MeasureMemoryMode } from "vm"

class Handler {
    prefix: string
    /**
     * Constructor to login to your bot
     * @param client - The client variable
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
    setCommand(options: { command: string, filetype: string }) {
        if(typeof options.command !== "string") {
            throw new TypeError("option command must be type string")
        } else {
            if(fs.statSync(options.command).isDirectory()) {
                if(options.filetype === "" || options.filetype !== "") {
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
    setEventFolder(options: { eventFolder: string}) {
        if(typeof options.eventFolder !== "string") {
            throw new Error("option command must be type string")
        } else {
            if(fs.statSync(options.eventFolder).isDirectory()) {
                let collection = new Collection()
                let commandFolder = fs.readdirSync(options.eventFolder).filter(w => w.endsWith(".js"))
                for(let eventFile of commandFolder) {
                    let events = require(`${options.eventFolder}/${eventFile}`)
                    collection.set(events.name, events)
                }
                return collection
            } else {
                throw new Error("The directory you provided is not a directory")
            }
        }
    }
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
}

export = Handler