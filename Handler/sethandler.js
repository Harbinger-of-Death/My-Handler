class RaidenSet extends Set {
    constructor() {
        super()
    }
    /**
     * Adds an element to the set
     * @param k - The element you want to add
     */
    add(k) {
        return super.add(k)
    }
    /**
     * Gets the first element in the Set
     * @returns {any} value
     */
    first() {
        return this.keys().next().value
    }
    /**
     * Filters the current set and returns the filtered set
     * @returns {this}
     */
    filter(fn) {
        let result = new this.constructor
        for(let key of this) {
            if(fn(key)) result.add(key)
        }
        return result
    }
}

module.exports = RaidenSet