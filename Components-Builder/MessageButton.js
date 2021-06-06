class MessageButton {
    constructor(data = {}) {
        this.setup(data)
    }

    setup(data) {
        this.disable = "disable" in data ? data.disable : null
        this.buttonType = "buttonType" in data ? data.buttonType : null
        this.label = "label" in data ? data.label : null
        this.style = "style" in data ? data.style : null
        this.custom_id = "custom_id" in data ? data.custom_id : null
        this.emoji = "emoji" in data ? data.emoji : null
    }
    /**
     * Sets the disable status for this button
     * @param {number} disable - The disable status for this button
     */
    setDisabled(disable) {
        this.disable = disable
        return this
    }
    /**
     * Sets the type for the button
     * @param {number} type - The type for this button
     */
    setButtonType(buttonType) {
        this.buttonType = buttonType
        return this
    }
    /**
     * Sets the label for this button
     * @param {string} label - The label for this button
     */
    setLabel(label) {
        this.label = label
        return this
    }
    /**
     * Sets the button style for this component
     * @param {number} style - The style
     */
    setStyle(style) {
        this.style = style
        return this
    }
    /**
     * Sets the ID for this component
     * @param {string} id - The id for this component
     */
    setID(id) {
        this.custom_id = id
        return this
    }
    /**
     * Sets the emoji for this button
     * @param {string} emoji - The emoji
     */
    setEmoji(emoji) {
        this.emoji = emoji
        return this
    }

    toJson() {
        return !this.emoji ? {
            type: this.buttonType,
            label: this.label,
            style: this.style,
            custom_id: this.custom_id,
        }
        : {
            type: this.buttonType,
            label: this.label,
            style: this.style,
            custom_id: this.custom_id,
            emoji: /\d{17,18}/gim.test(this.emoji) ? { id: this.emoji} : { name: this.emoji}
        }
    }
}

module.exports = MessageButton