import { Client, Collection } from "discord.js"

import * as fs from "fs"

class Handler {
    constructor(
        client: Client) {
        if(!client) {
            throw new Error("Please initiate a client")
        }
    }
    /**
     * This method is to set your default prefix
     * @param prefix - The prefix you want, must be type string
     * @type string | string[]
     */
    setPrefix(prefix: string | string[]): string | string[] {
        if(typeof prefix === "string" || Array.isArray(prefix)) {
            return prefix
        } else {
            throw new TypeError("Prefix must be type string or an Array")
        }
    }
    /**
     * This method sets your command folder to the one you specified in option.command parameter
     * @property option.command - The command dir where you want your bot to check files
     * @property option.filetype - The filetype you want your bot to check specifically. Default is .js
     */
    setCommand(options: { command: string, filetype: string }) {
        if(typeof options.command !== "string") {
            throw new Error("option command must be type string")
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
}

export = Handler