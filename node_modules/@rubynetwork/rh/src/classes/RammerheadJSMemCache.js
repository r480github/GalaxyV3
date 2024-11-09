import LRUCache from 'lru-cache';

class RammerheadJSMemCache {
    constructor(jsCacheSize) {
        this.lru = new LRUCache({
            maxSize: jsCacheSize,
            sizeCalculation: (n) => n.length || 1
        });
    }
    get(key) {
        this.lru.get(key);
    }
    set(key, value) {
        this.lru.set(key, value);
    }
}

export default RammerheadJSMemCache;
