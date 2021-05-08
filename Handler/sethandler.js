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
        /**
     * Deletes a value you specified in the param
     * @param value - The value you want to delete
     * @returns {boolean}
     */
    delete(value) {
        if(!value) throw new Error("Expect value=value, but got value=undefined")
        return super.delete(value)
    }
    /**
     * Maps the value that returns true from fn
     * @returns {any[]}
     */
    map(fn) {
        let index = 0
        let values = this.keys()
        return Array.from({
            length: this.size
        }, () => {
            for(let value of values) {
                if(fn(value)) return fn(value, index++)
            }
        }).filter(item => item)
    }
    /**
     * Finds an element that return true from fn and return it's value
     *
     */
    find(fn) {
        for(let val of this) {
            if(fn(val)) return val
        }
        return undefined
    }
    /**
     * Maps all values in the set to an array
     * @param limit - The length of the array you want. Default is 5
     * @returns {any[]}
     */
    array(limit) {
        let arr = []
        for(let values of this) {
            arr.push(values)
        }
        return limit ? arr.slice(0, limit) : arr.slice(0, 5)
    }
    /**
     * Returns the overall value of the Set
     * @returns {number}
     */
    get size() {
        return super.size
    }
    /**
     * Clears the Set of all values
     */
    clear() {
        return super.clear()
    }
    /**
     * Gets the last value from the Set
     * 
     */
    last() {
        let arr = []
        for(let value of this) {
            arr.push(value)
        }
        return arr[arr.length - 1]
    }
}

module.exports = RaidenSet