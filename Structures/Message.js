const MessageButton = require("./MessageButton.js")
const MessageButtonRow = require("./MessageButtonRow.js")
class Message {
    constructor(client, channel) {
        this.client = client
        this.channel = channel
    }
    send(components = { button }) {
        if(Array.isArray(components.button)) {
            if(components.button.length > 5) throw new RangeError("Button Row must only be 5, not above")
            if(components.button.some(array => !(array instanceof MessageButtonRow))) throw new Error("Components must be instance of MessageButtonRow")
            return this.client.api.channels(this.channel).messages.post({
                data: {
                    content: "Hello there",
                    components: components.button.map(row => new MessageButtonRow(row.data1).toJson())
                }
            })
        } else {
            let errorMessage = `component.button must be instanceof MessageButton ${!(components.button instanceof MessageButton) ? `but received=${typeof components.button}` : ""}`
            if(!(components.button instanceof MessageButton)) throw new Error(errorMessage)
            return this.client.api.channels(this.channel).messages.post({
                data: {
                    content: "Hello there",
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