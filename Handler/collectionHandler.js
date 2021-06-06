"use strict";

class RaidenCol extends Map {
    constructor() {
        super()
    }
    /**
     * Returns the count of how many elemets are in the collection
     * @returns {number}
     */
    get size() {
        return super.size
    }
    /**
     * Identical to Array.map() where as it returns a mapped Array of the collection
     * @returns {any[]}
     */
    map(fn) {
        // console.log(iter.next())
        let index = 0
        let values = this.entries()
        return Array.from({
            length: this.size
        }, () => {
            for(let [key, val] of values) {
                if(fn(key)) return fn(key, index++)
            }
        }).filter(item => item)
    }
    /**
     * An equivalent method for the map method of this class but it maps by it's values that returns true from fn
     * @returns {any[]}
     */
    mapVal(fn) {
        let val = this.values()
        return Array.from({
            length: this.size
        }, () => {
            let values = val.next()
            return fn(values.value)
        }).filter(item => item)
    }
    /**
     * Returns the first value in the Collection
     */
    first() {
        let firstVal = this.values().next()
        return firstVal.value
    }
    /**
     * Finds an element in the collection and return it's value, otherwise returns undefined
     * @returns {any}
     */
    find(fn) {
        for(let [key, val] of this) {
            if(fn(key, val)) return val
        }
        return undefined
    }
    /**
     * Filters the current Map and returns a filtered Map instead of an Array
     * @returns {this}
     */
    filter(fn = (key, val) => any) {
        let result = new this.constructor[Symbol.species]
        for(let [key, val] of this) {
            if(fn(key, val)) result.set(key, val)
        }
        return result
    }
    /**
     * Returns the last value in the Collection
     */
    last() {
        return Array.from(this.values())[Array.from(this.values()).length - 1]
    }
    /**
     * Returns the last key in the collection
     */
    lastKey() {
        return Array.from(this.keys())[Array.from(this.keys()).length - 1]
    }
	/**
	 * Runs a function on the collection and returns the collection.
	 * @param {Function} fn Function to execute
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {this}
	 * @example
	 * collection
	 *  .tap(coll => console.log(coll.size))
	 *  .filter(user => user.bot)
	 *  .tap(coll => console.log(coll.size))
	 */
    tap(fn){
        fn(this)
        return this
    }
    /**
     * Returns a boolean whether or not the key exist in the Collection
     * @param {string} k - They key to check
     * @returns {boolean}
     * @example
     * .set("Hello", "val")
     * .has("Hello") //expected output: true
     */
    has(k) {
        return super.has(k)
    }
    /**
     * Turn the Collection in to an array
     * @returns {any[]} []
     */
    array() {
        let arr = []
        for(let [key, val] of this) {
            arr.push({
                keys: key,
                values: val
            })
        }
        return arr
    }
    /**
     * Put the keys of the Collection in to an array
     * @param {number} limit - The limit of the keys you only want to be in an array. Default is 5
     * @returns {any[]} []
     */
    keyArray(limit) {
        let arr = []
        for(let [key, val] of this) {
            arr.push(key)
        }
        if(limit) {
            return arr.slice(0, limit)
        } else {
            return arr.slice(0, 5)
        }
    }
    /**
     * Checks if specified array of keys exists in the collection
     * @param {any[]} c - The array of keys you want to check if exist
     */
    hasAll(c) {
        if(!Array.isArray(c)) throw new TypeError("Method param takes an array of Keys")
        for(let key of c) {
            if(this.has(key)) return console.log(key + " = " + true)
        }
        return false
    }
}

module.exports = RaidenCol
