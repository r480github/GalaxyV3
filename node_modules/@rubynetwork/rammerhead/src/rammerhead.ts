// @ts-expect-error pure JS lib lmao
import { default as crh } from '@rubynetwork/rh/src/server/index.js';

type logLevel = "disabled" | "debug" | "traffic" | "info" | "warn" | "error" 

interface Options {
    logLevel?: logLevel
    reverseProxy?: boolean,
    disableLocalStorageSync?: boolean,
    disableHttp2?: boolean
}

const scopes = [
    '/rammerhead.js',
    '/hammerhead.js',
    '/transport-worker.js',
    '/task.js',
    '/iframe-task.js',
    '/worker-hammerhead.js',
    '/messaging',
    '/sessionexists',
    '/deletesession',
    '/newsession',
    '/editsession',
    '/needpassword',
    '/syncLocalStorage',
    '/api/shuffleDict',
    '/mainport'
]

const rammerheadSession = /^\/[a-z0-9]{32}/;

function shouldRouteRh(req: any) {
    const url = new URL(req.url, 'http://0.0.0.0');
    return scopes.includes(url.pathname) || rammerheadSession.test(url.pathname);
}

function routeRhRequest(rh: crh, req: any, res: any) {
    rh.emit('request', req, res);
}

function routeRhUpgrade(rh: crh, req: any, socket: any, head: any) {
    rh.emit('upgrade', req, socket, head);
}

function createRammerhead(options: Options) {
    return crh({
        logLevel: options.logLevel || "debug",
        reverseProxy: options.reverseProxy || false,
        disableLocalStorageSync: options.disableLocalStorageSync || false,
        disableHttp2: options.disableHttp2 || false,
    })
}

const rammerhead = {
    shouldRouteRh,
    routeRhRequest,
    routeRhUpgrade,
    createRammerhead
}

export default rammerhead;
export { createRammerhead, shouldRouteRh, routeRhRequest, routeRhUpgrade, logLevel }
