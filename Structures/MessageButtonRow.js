const MessageButton = require("./MessageButton.js")
class MessageButtonRow {
    constructor(data = {}) {
        if(!Array.isArray(data)) throw new TypeError("data must be Array to use in a ActionRow")
        if(data.length > 5) throw new RangeError("Only 5 buttons per row")
        this.setup(data)
    }

    setup(data) {
        this.data1 = data
    }

    toJson() {
        return {
            type: 1,
            components: this.data1.map(button => new MessageButton(button).toJson())
        }
    }
}

module.exports = MessageButtonRow