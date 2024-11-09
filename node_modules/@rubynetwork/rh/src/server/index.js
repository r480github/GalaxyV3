import exitHook from 'async-exit-hook';
import sticky from 'sticky-session-custom';
import RammerheadLogging from '../classes/RammerheadLogging.js';
import RammerheadProxy from '../classes/RammerheadProxy.js';
import RammerheadSessionFileCache from '../classes/RammerheadSessionFileCache.js';
import config from '../config.js';
import addStaticDirToProxy from '../util/addStaticDirToProxy.js';
import getSessionId from '../util/getSessionId.js';
import setupPipeline from './setupPipeline.js';
import setupRoutes from './setupRoutes.js';

/**
    * @description 
    * Create a Rammerhead server (internal only)
    *
    * @param {Object} options
    * @param {"disabled"|"debug"|"traffic"|"info"|"warn"|"error"} [options.logLevel='info'] Set the log level
    * @param {Boolean} [options.reverseProxy=true] Whether or not this is set behind a reverse proxy
    * @param {Boolean} [options.disableLocalStorageSync=false] turn off if clients send huge localStorage data resulting in huge memory usage
    * @param {Boolean} [options.disableHttp2=false] disable http2 (will result in less site support)
    * @returns {import('node:http').Server}
    */
function createRammerhead(options) {
    const logger = new RammerheadLogging({
        logLevel: options.logLevel ||= config.logLevel,
        generatePrefix: (level) => config.generatePrefix(level)
    });

    let ipGet = null;
    if (options.reverseProxy !== true) {
        ipGet = config.getIP
    }
    else {
        ipGet = config.getIPProxy
    }
    const proxyServer = new RammerheadProxy({
        logger,
        loggerGetIP: ipGet,
        bindingAddress: config.bindingAddress,
        port: config.port,
        crossDomainPort: null,
        dontListen: true,
        ssl: config.ssl,
        getServerInfo: config.getServerInfo,
        disableLocalStorageSync: options.disableLocalStorageSync ||= config.disableLocalStorageSync,
        jsCache: config.jsCache,
        disableHttp2: options.disableHttp2 ||= config.disableHttp2
    });

    if (config.publicDir) addStaticDirToProxy(proxyServer, config.publicDir);

    const fileCacheOptions = { logger, ...config.fileCacheSessionConfig };
    const sessionStore = new RammerheadSessionFileCache(fileCacheOptions);
    sessionStore.attachToProxy(proxyServer);

    setupPipeline(proxyServer, sessionStore);
    setupRoutes(proxyServer, sessionStore, logger);

    // nicely close proxy server and save sessions to store before we exit
    exitHook(() => {
        proxyServer.close();
    });

    return proxyServer.server1;
}

// if you want to just extend the functionality of this proxy server, you can
// easily do so using this. mainly used for debugging
export default createRammerhead;
