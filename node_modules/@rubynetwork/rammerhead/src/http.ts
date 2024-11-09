import http from 'node:http';
import { createRammerhead, shouldRouteRh, routeRhUpgrade, routeRhRequest, logLevel } from './rammerhead.js';
import pc from "picocolors";

interface ServerOptions {
    port: number,
    host: string,
    logLevel: logLevel,
    reverseProxy: boolean
}

function startServer(options: ServerOptions) {
    //create the Rammerhead server!
    const rh = createRammerhead({
        logLevel: options.logLevel,
        reverseProxy: options.reverseProxy,
        disableLocalStorageSync: false,
        disableHttp2: false
    });
    //basic http server
    const server = http.createServer();
    server.on('request', (req: any, res: any) => {
        if (shouldRouteRh(req)) {
            routeRhRequest(rh, req, res)
        }
    })
    server.on('upgrade', (req: any, socket: any, head: any) => {
        if (shouldRouteRh(req)) {
            routeRhUpgrade(rh, req, socket, head);
        }
    });
    server.listen({
        host: options.host,
        port: options.port || 8080
        }, () => {
            console.log(pc.red(`Standalone Rammerhead server listening: http://${options.host}:${options.port || 8080}`))
        }
    )
}

export { startServer }
