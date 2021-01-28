"use strict";
var discord_js_1 = require("discord.js");
var fs = require("fs");
var Handler = /** @class */ (function () {
    function Handler(client) {
        if (!client) {
            console.log("Please instantiate a Client");
        }
    }
    /**
     * This method is to set your default prefix
     * @param prefix - The prefix you want, must be type string
     */
    Handler.prototype.setPrefix = function (prefix) {
        if (typeof prefix !== "string") {
            throw new TypeError("PLease make sure the prefix is a type string");
        }
        else {
            return prefix;
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
    return Handler;
}());
module.exports = Handler;
