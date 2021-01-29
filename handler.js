"use strict";
var discord_js_1 = require("discord.js");
var fs = require("fs");
var dotenv = require("dotenv");
dotenv.config();
var Handler = /** @class */ (function () {
    /**
     * Constructor to login to your bot
     * @param client - The client variable
     * @param token - Your token goes here
     */
    function Handler(client) {
        if (!client) {
            throw new Error("Please initiate a client");
        }
        if (!process.env.TOKEN) {
            throw new Error("Please make sure you have made a environment variable for your token");
        }
        else {
            client.login(process.env.TOKEN);
        }
    }
    /**
     * This method is to set your default prefix
     * @param prefix - The prefix you want, must be type string
     * @type string | string[]
     */
    Handler.prototype.setPrefix = function (prefix) {
        if (typeof prefix === "string" || Array.isArray(prefix)) {
            return prefix;
        }
        else {
            throw new TypeError("Prefix must be type string or an Array");
        }
    };
    /**
     * This method sets your command folder to the one you specified in option.command parameter
     * @property option.command - The command dir where you want your bot to check files
     * @property option.filetype - The filetype you want your bot to check specifically. Default is .js
     */
    Handler.prototype.setCommand = function (options) {
        if (typeof options.command !== "string") {
            throw new Error("option command must be type string");
        }
        else {
            if (fs.statSync(options.command).isDirectory()) {
                if (options.filetype === "" || options.filetype !== "") {
                    var default_filetype_1 = ".js";
                    var collection = new discord_js_1.Collection();
                    var commandFolder = fs.readdirSync(options.command).filter(function (w) { return w.endsWith(!options.filetype ? default_filetype_1 : options.filetype); });
                    for (var _i = 0, commandFolder_1 = commandFolder; _i < commandFolder_1.length; _i++) {
                        var file = commandFolder_1[_i];
                        var command = require(options.command + "/" + file);
                        collection.set(command.name, command);
                    }
                    return collection;
                }
            }
            else {
                throw new Error("The directory you provided is not a directory");
            }
        }
    };
    Handler.prototype.setEventFolder = function (options) {
        if (typeof options.eventFolder !== "string") {
            throw new Error("option command must be type string");
        }
        else {
            if (fs.statSync(options.eventFolder).isDirectory()) {
                var collection = new discord_js_1.Collection();
                var commandFolder = fs.readdirSync(options.eventFolder).filter(function (w) { return w.endsWith(".js"); });
                for (var _i = 0, commandFolder_2 = commandFolder; _i < commandFolder_2.length; _i++) {
                    var eventFile = commandFolder_2[_i];
                    var events = require(options.eventFolder + "/" + eventFile);
                    collection.set(events.name, events);
                }
                return collection;
            }
            else {
                throw new Error("The directory you provided is not a directory");
            }
        }
    };
    return Handler;
}());
module.exports = Handler;
