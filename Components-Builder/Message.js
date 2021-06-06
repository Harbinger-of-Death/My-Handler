const MessageButton = require("./MessageButton.js")
const MessageButtonRow = require("./MessageButtonRow.js")
class Message {
    /**
     * @param {import("discord.js").Client} client - The client of this message
     * @param {string} channel - The channel id
     */
    constructor(client, channel) {
        this.client = client
        this.channel = channel
    }
    /**
     * Sends an API req to DAPI to send a message
     * @param {string} content - The content of the message
     * @param {object} components - The components
     * @param { MessageButton | MessageButtonRow[] } components.button - The MessageButton or a Row of them
     */
    send(content, components = { button }) {
        if(Array.isArray(components.button)) {
            if(components.button.length > 5) throw new RangeError("Button Row must only be 5, not above")
            if(components.button.some(array => !(array instanceof MessageButtonRow))) throw new Error("Components must be instance of MessageButtonRow")
            return this.client.api.channels(this.channel).messages.post({
                data: {
                    content: content ? content : "",
                    components: components.button.map(row => new MessageButtonRow(row.data1).toJson())
                }
            })
        } else {
            let errorMessage = `component.button must be instanceof MessageButton ${!(components.button instanceof MessageButton) ? `but received=${typeof components.button}` : ""}`
            if(!(components.button instanceof MessageButton)) throw new Error(errorMessage)
            return this.client.api.channels(this.channel).messages.post({
                data: {
                    content: content ? content : "",
                    components: [
                        {
                            type: 1,
                            components: [
                                new MessageButton(components.button)
                            ]
                        }
                    ]
                }
            })
        }
    }
}

module.exports = Message