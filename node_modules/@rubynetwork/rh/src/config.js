import fs from 'fs';
import os from 'os';
import path from 'path';
import cookie from 'cookie';
import RammerheadJSFileCache from './classes/RammerheadJSFileCache.js';
import RammerheadJSMemCache from './classes/RammerheadJSMemCache.js';

const enableWorkers = os.cpus().length !== 1;

export default {
    //// HOSTING CONFIGURATION ////

    bindingAddress: '127.0.0.1',
    port: 8080,
    crossDomainPort: 8081,
    publicDir: path.join(import.meta.dirname, '../public'), // set to null to disable

    // enable or disable multithreading
    enableWorkers,
    workers: os.cpus().length,

    // ssl object is either null or { key: fs.readFileSync('path/to/key'), cert: fs.readFileSync('path/to/cert') }
    // for more info, see https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
    ssl: null,

    // this function's return object will determine how the client url rewriting will work.
    // set them differently from bindingAddress and port if rammerhead is being served
    // from a reverse proxy.
    //getServerInfo: () => ({
    //    hostname: 'localhost',
    //    port: 8080,
    //    crossDomainPort: 8081,
    //    protocol: 'http:'
    //}),
    getServerInfo: (req) => {
        const { origin_proxy } = cookie.parse(req.headers.cookie || '');
        console.log(req.socket)
        let origin;
        try {
            origin = new URL(origin_proxy);
        } catch (err) {
            console.log(err, req.headers.cookie);
            origin = new URL(`https://${req.headers.host}`);
        }
        const { hostname, port, protocol } = origin;
        return {
            hostname,
            port,
            crossDomainPort: port,
            protocol
        };
    },
    // example of non-hard-coding the hostname header
    // getServerInfo: (req) => {
    //     return { hostname: new URL('http://' + req.headers.host).hostname, port: 443, crossDomainPort: 8443, protocol: 'https: };
    // },

    // enforce a password for creating new sessions. set to null to disable
    password: null,

    // disable or enable localStorage sync (turn off if clients send over huge localStorage data, resulting in huge memory usages)
    disableLocalStorageSync: false,

    // restrict sessions to be only used per IP
    restrictSessionToIP: true,

    // caching options for js rewrites. (disk caching not recommended for slow HDD disks)
    // recommended: 50mb for memory, 5gb for disk
    // jsCache: new RammerheadJSMemCache(5 * 1024 * 1024),
    jsCache: new RammerheadJSFileCache(
        path.join(import.meta.dirname, '../cache-js'),
        5 * 1024 * 1024 * 1024,
        50000,
        enableWorkers
    ),

    // whether to disable http2 support or not (from proxy to destination site).
    // disabling may reduce number of errors/memory, but also risk
    // removing support for picky sites like web.whatsapp.com that want
    // the client to connect to http2 before connecting to their websocket
    disableHttp2: false,

    //// REWRITE HEADER CONFIGURATION ////

    stripClientHeaders: [
        'cf-ipcountry',
        'cf-ray',
        'x-forwarded-proto',
        'cf-visitor',
        'cf-connecting-ip',
        'cdn-loop',
        'x-forwarded-for'
    ],
    // if you want to modify response headers, like removing the x-frame-options header, do it like so:
    rewriteServerHeaders: {
        'x-frame-options': null // set to null to tell rammerhead that you want to delete it
    },
    //// SESSION STORE CONFIG ////

    // see src/classes/RammerheadSessionFileCache.js for more details and options
    fileCacheSessionConfig: {
        saveDirectory: path.join(import.meta.dirname, '../sessions'),
        cacheTimeout: 1000 * 60 * 20, // 20 minutes
        cacheCheckInterval: 1000 * 60 * 10, // 10 minutes
        deleteUnused: true,
        staleCleanupOptions: {
            staleTimeout: 1000 * 60 * 60 * 24 * 3, // 3 days
            maxToLive: null,
            staleCheckInterval: 1000 * 60 * 60 * 6 // 6 hours
        },
        // corrupted session files happens when nodejs exits abruptly while serializing the JSON sessions to disk
        deleteCorruptedSessions: true
    },

    //// LOGGING CONFIGURATION ////

    // valid values: 'disabled', 'debug', 'traffic', 'info', 'warn', 'error'
    logLevel: process.env.DEVELOPMENT ? 'debug' : 'info',
    generatePrefix: (level) => `[${new Date().toISOString()}] [${level.toUpperCase()}] `,

    // logger depends on this value
    getIP: (req) => req.socket.remoteAddress,
    // use the example below if rammerhead is sitting behind a reverse proxy like nginx
    getIPProxy: req => (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim(),
};

if (fs.existsSync(path.join(import.meta.dirname, '../config.js')))
    Object.assign(module.exports, require('../config'));
