import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { join } from "node:path";
import { hostname } from "node:os";
import wisp from "wisp-server-node";
import rammerhead from '@rubynetwork/rammerhead';
import { createRammerhead, shouldRouteRh, routeRhUpgrade, routeRhRequest } from '@rubynetwork/rammerhead';
import { meteorPath } from 'meteorproxy'


const __dirname = process.cwd();
const app = express();

const publicPath = join(__dirname, "public");
app.use(express.static(publicPath));

app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/meteor/", express.static(meteorPath));

const server = createServer();
const rh = createRammerhead({
    logLevel: 'debug', //Options are: disabled, debug, traffic, info, warn, error (default: debug)
    reverseProxy: false, //whether or not this server is running behind a reverse proxy (default: false)
    disableLocalStorageSync: false, //disable localstorage sync (not recommended) (default: false)
    disableHttp2: false //disable http2 usage (default: false) (NOT RECOMMENDED)
});

app.use((req, res) => {
    res.status(404);
    res.sendFile(join(publicPath, "index.html"));
});

server.on("request", (req, res) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "anonymous");
    if (shouldRouteRh(req)) {
        routeRhRequest(rh /* from the createRammerhead function MUST be passed */, req, res)
    }
    else {
        app(req, res);
    }
});

server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head)
    }
    else if (rammerhead.shouldRouteRh(req)) {
        rammerhead.routeRhUpgrade(rh, req, socket, head)
    }
    else {
        socket.end()
    }
});

let port = parseInt(process.env.PORT || "8080");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
    const address = server.address();

    // by default we are listening on 0.0.0.0 (every interface)
    // we just need to list a few
    console.log("Listening on:");
    console.log(`\thttp://localhost:${address.port}`);
    console.log(`\thttp://${hostname()}:${address.port}`);
    console.log(
        `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address
        }:${address.port}`
    );

});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close();
    process.exit(0);
}

server.listen({
    port,
});