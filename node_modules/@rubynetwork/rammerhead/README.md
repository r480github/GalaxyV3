# Rammerhead Package

- Easily consume and use Rammerhead server side


## CLI
- Fires up a standalone server for Rammerhead

```
npx @rubynetwork/rammerhead
```

### Flags:

- `-ho, --host <host>` - Listen on a specific host (default: `0.0.0.0`)
- `-p, --port <port>` - The port to listen on (default: `8080`)
- `-l, --loglevel <loglevel>` - Change the log level (default: `debug`) [options: `disabled`, `debug`, `traffic`, `info`, `warn`, `error`]
- `-rp, --reverseproxy` - Whether or not the server is behind a reverse proxy. (default: `false`)
- `-h, --help` - Show this same type of info

## Usage:

- Basic server (import required items): 
```js
import { createRammerhead, shouldRouteRh, routeRhUpgrade, routeRhRequest } from '@rubynetwork/rammerhead';

const rh = createRammerhead({
    logLevel: 'debug', //Options are: disabled, debug, traffic, info, warn, error (default: debug)
    reverseProxy: false, //whether or not this server is running behind a reverse proxy (default: false)
    disableLocalStorageSync: false, //disable localstorage sync (not recommended) (default: false)
    disableHttp2: false //disable http2 usage (default: false) (NOT RECOMMENDED)
})

const server = http.createServer();
server.on('request', (req, res) => {
    if (shouldRouteRh(req)) {
        routeRhRequest(rh /* from the createRammerhead function MUST be passed */, req, res)
    }
})
server.on('upgrade', (req, socket, head) => {
    if (shouldRouteRh(req)) {
        routeRhUpgrade(rh /* from the createRammerhead funtion MUST be passed */, req, socket, head)
    }
})
server.listen({host: '0.0.0.0', port: 8080}, () => {
    console.log('Server is listening on port 8080!');
})
```

- Basic server (default export):
```js
import rammerhead from '@rubynetwork/rammerhead';

const rh = rammerhead.createRammerhead({
    logLevel: 'debug', //Options are: disabled, debug, traffic, info, warn, error (default: debug)
    reverseProxy: false, //whether or not this server is running behind a reverse proxy (default: false)
    disableLocalStorageSync: false, //disable localstorage sync (not recommended) (default: false)
    disableHttp2: false //disable http2 usage (default: false) (NOT RECOMMENDED)
})

const server = http.createServer();
server.on('request', (req, res) => {
    if (rammerhead.shouldRouteRh(req)) {
        rammerhead.routeRhRequest(rh /* from the createRammerhead function MUST be passed */, req, res)
    }
})
server.on('upgrade', (req, socket, head) => {
    if (rammerhead.shouldRouteRh(req)) {
        rammerhead.routeRhUpgrade(rh /* from the createRammerhead funtion MUST be passed */, req, socket, head)
    }
})
server.listen({host: '0.0.0.0', port: 8080}, () => {
    console.log('Server is listening on port 8080!');
})
```

- Express:
```js
import express from "express";
import { createServer } from "node:http";
import { createRammerhead, shouldRouteRh, routeRhUpgrade, routeRhRequest } from '@rubynetwork/rammerhead';

const app = express();
const server = createServer();
const rh = rammerhead.createRammerhead({
    logLevel: 'debug', //Options are: disabled, debug, traffic, info, warn, error (default: debug)
    reverseProxy: false, //whether or not this server is running behind a reverse proxy (default: false)
    disableLocalStorageSync: false, //disable localstorage sync (not recommended) (default: false)
    disableHttp2: false //disable http2 usage (default: false) (NOT RECOMMENDED)
})

server.on("request", (req, res) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  if (shouldRouteRh(req)) {
    routeRhRequest(rh /* from the createRammerhead function MUST be passed */, req, res)
  }
  else {
    app(req, res);
  }
});
server.on("upgrade", (req, socket, head) => {    
    if (rammerhead.shouldRouteRh(req)) {
        rammerhead.routeRhUpgrade(rh /* from the createRammerhead funtion MUST be passed */, req, socket, head)
    }
    else {
        socket.end()
    }
});

server.on("listening", () => {
  console.log("Listening on: http://localhost:8080");
});

server.listen({port: 8080});
```

- Fastify:
```js
import Fastify from 'fastify';
import { createServer } from 'node:http';
import { createRammerhead, shouldRouteRh, routeRhUpgrade, routeRhRequest } from '@rubynetwork/rammerhead';

const rh = rammerhead.createRammerhead({
    logLevel: 'debug', //Options are: disabled, debug, traffic, info, warn, error (default: debug)
    reverseProxy: false, //whether or not this server is running behind a reverse proxy (default: false)
    disableLocalStorageSync: false, //disable localstorage sync (not recommended) (default: false)
    disableHttp2: false //disable http2 usage (default: false) (NOT RECOMMENDED)
})

const serverFactory = (handler) => {
  return createServer()
    .on('request', (req, res) => {
      if (shouldRouteRh(req)) {
        routeRhRequest(rh /* from the createRammerhead function MUST be passed */, req, res)
      }
      else {
          handler(req, res);
      }
    })
    .on('upgrade', (req, socket, head) => {
      if (shouldRouteRh(req)) {
        routeRhUpgrade(rh /* from the createRammerhead funtion MUST be passed */, req, socket, head)
      }
    });
};

const app = Fastify({ logger: false, serverFactory: serverFactory });

app.listen({ port: 8080, host: '0.0.0.0' });
console.log('Server is listening on: http://localhost:8080.');
```
