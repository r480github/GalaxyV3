class RammerheadJSAbstractCache {
    constructor() {
        throw new TypeError('abstract method');
    }
    async get(key) {
        throw new TypeError('abstract method');
    }
    async set(key, value) {
        throw new TypeError('abstract method');
    }
}

export default RammerheadJSAbstractCache;
