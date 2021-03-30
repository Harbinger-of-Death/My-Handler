export default class MyCollection<K, V> {
    private collection: Map<K, V>
    constructor() {
        this.collection = new Map()
    }
    /**
     * Gets a key in the Map
     * @param k - The key you want to get
     */
    public get(k: K): V {
        return this.collection.get(k)
    }
    /**
     * Sets a key and value in to the Map(). Identical to [Map.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set)
     * @param k  - Key
     * @param v - Value
     */
    public set(k: K, v: V): Map<K, V> {
        return this.collection.set(k, v)
    }
    /**
     * This gets the first value in the Map
     */
    public first(): IteratorResult<V> {
        return this.collection.values().next()
    }
    /**
     * This gets the last value in the Map
     */
    public last(): V[] | V {
        return !Array.from(this.collection.values()) ? [] : Array.from(this.collection.values())[this.collection.size - 1]
    }
    /**
     * Gets the keys from the Map
     * @param num - The number of the position of the keys you want
     * @param last - Just gets the last key in the Map
     */
    public keyArray(options?: {num?: number, last?: boolean}) {
        if(options?.last) {
            return !Array.from(this.collection.keys()) ? [] : Array.from(this.collection.keys())[Array.from(this.collection.keys()).length - 1]
        } else if(options?.num) {
            return !Array.from(this.collection.keys()) ? [] : Array.from(this.collection.keys())[options.num]
        } else {
            return !Array.from(this.collection.keys()) ? [] : Array.from(this.collection.keys()).map(k => k)
        }
    }
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackFn - A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     */
    public map(fn: (value: V, index: number, keys: any) => any, thisArg?: unknown): string[] {
        if(typeof thisArg !== "undefined") fn = fn.bind(thisArg)
        let arr = []
        this.collection.forEach((value, key) => {
            let keys = !key ? "" : key
            let values = !value ? "" : value
            arr.push({keys, values})
        })
        return arr.map(fn)
    }
    /**
    * Gets the first key in the Map()
    */
    public firstKey(): IteratorResult<K, any> {
        return this.collection.keys().next()
    }
    /**
     * Gets the size of the Map()
     */
    get size(): number {
        return this.collection.size
    }

    public forEach(callbackFn: (value: V, key: K, map: Map<K, V>) => void) {
        return this.collection.forEach(callbackFn)
    }
    /**
     * Returns an array of the Map()
     */
    public array(): string[] | K[] {
        let arr = []
        this.collection.forEach((value, key) => {
            let keys = !key ? "" : key
            let values = !value ? "" : value
            arr.push({keys, values})
        })
        return arr
    }
    /**
     * Checks the Map if the key is in it
     * @param k - The key you want to look for
    */
    public has(k: K): boolean {
        return this.collection.has(k)
    }
    /**
     * Deletes a specific element in the Map
     * @param k - The key you want to delete
    */
    public delete(k: K): boolean {
       return this.collection.delete(k)
   }
   /**
    * Randomizes the Map()
    */
    public random(): V | V[] {
       let arr = []
       this.collection.forEach((value, key) => {
        let keys = !key ? "" : key
        let values = !value ? "" : value
        arr.push({keys, values})
       })
       return arr[Math.floor(Math.random() * arr?.length)]
   }
   /** Similar to Array.find(). Returns the value of the first element in the array of objects where fn is true, and undefined otherwise.
    @param fn
    find calls predicate once for each element of the array, in ascending order, until it finds one where fn returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
    @param thisArg
    If provided, it will be used as the this value for each invocation of fn. If it is not provided, undefined is used instead.
    */
    public find(fn: (value: V, key: any) => any[], thisArg?: unknown) {
       if(typeof thisArg !== "undefined") fn = fn.bind(thisArg)
       let arr = []
       this.collection.forEach((value, key) => {
            let keys = !key ? "" : key
            let values = !value ? "" : value
            arr.push({keys, values})
       })
       return arr.find(fn)
    }
    /**
     * Returns the elements of a collection that meet the condition specified in a callback function.
     * @param fn - A function that accepts up to three arguments. The filter method calls the fn function one time for each element in the collection.
     * @param thisArg - An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    public filter(fn: (value: any, index: any) => any[], thisArg?: unknown) {
		if(typeof thisArg !== "undefined") fn = fn.bind(thisArg)
        let arr = []
        this.collection.forEach((value, keys) => {
            arr.push({keys, value})
        })
        return arr.filter(fn)
    }
    /**
     * Deletes all elements in the Map()
     */
    get clear() {
        return this.collection.clear()
    }
}