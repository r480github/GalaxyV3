# Sticky session, but you choose what sticks

> this module is a fork of a [pull request][4] that attempted to solve the reverse proxy issue, but given that no one maintains it anymore (last commit was more than half a decade ago), package uses a deprecated API, and a needed feature of asynchronous worker shutdown and custom sticky logic, it was best to create a separate package altogether.

A simple flexible way to load balance your session-based or [socket.io][0] apps with a [cluster][1].

## Installation

```bash
npm install sticky-session-custom
```

## Usage and examples

- [Balancing based on direct IP connection](#balancing-based-on-direct-ip-connection)
- [Balancing based on `x-forwarded-for`](#balancing-based-on-x-forwarded-for)
- [Custom balancing logic](#custom-balancing-logic)
- [Shutting down gracefully](#shutting-down-gracefully)
- [Multiple HTTP servers](#multiple-http-servers)

### Balancing based on direct IP connection ###

This is the fastest since the load balancer doesn't need to parse any HTTP headers.

```javascript
var cluster = require('cluster'); // Only required if you want the worker id
var sticky = require('sticky-session-custom');

var server = require('http').createServer(function(req, res) {
  res.end('worker: ' + cluster.worker.id);
});

if (sticky.listen(server, 3000, '0.0.0.0', {
  workers: 4 // if workers is unset, it will use all the available cores in the system
})) {
  // Master code
  server.once('listening', function() {
    console.log('server started on 3000 port');
  });
} else {
  // Worker code
}
```


### Balancing based on `x-forwarded-for` ###

For running behind a reverse proxy that uses a header for sending over the client IP, specify that header using `proxyHeader`.

**Note that this approach is a bit slower as it needs to first parse the request headers.**

```javascript
var cluster = require('cluster');
var sticky = require('sticky-session-custom');

var server = require('http').createServer(function(req, res) {
  res.end('worker: ' + cluster.worker.id);
});

var closeMaster = sticky.listen(server, 3000, '0.0.0.0', {
  proxyHeader: 'x-forwarded-for' // header to read for IP
});

if (closeMaster) {
  // Master code
  server.once('listening', function() {
    console.log('server started on 3000 port');
  });
} else {
  // Worker code
}
```


### Custom balancing logic ###

If you want more control over what sticks, you can specify a custom function that generates an array of numbers to be hashed, which determines the worker to forward to. Below is an example of forwarding authenticated requests to the same worker.

**Note that this approach is a bit slower as it needs to first parse the request headers, (but if you don't need those, use generatePrehashArrayNoParsing instead)**

```javascript
var cluster = require('cluster');
var sticky = require('sticky-session-custom');

var server = require('http').createServer(function(req, res) {
  res.end('worker: ' + cluster.worker.id);
});

var closeMaster = sticky.listen(server, 3000, '0.0.0.0', {
  generatePrehashArray(req, socket) {
    var parsed = new URL(req.url, 'https://dummyurl.example.com');
    // you can use '' instead of Math.random() if you want to use a consistent worker
    // for all unauthenticated requests
    var userToken = parsed.searchParams.get('token') || Math.random().toString();
    // turn string into an array of numbers for hashing
    return (userToken.split('') || ' ').map(e => e.charCodeAt());
  }
});

if (closeMaster) {
  // Master code
  server.once('listening', function() {
    console.log('server started on 3000 port');
  });
} else {
  // Worker code
}
```


### Shutting down gracefully ###

If there is no listener for SIGINT in the worker, it calls `process.exit()` directly. Otherwise, it does `process.emit('SIGINT')` and lets the listener shut it down. For this module, it is best to be used in conjunction with `async-exit-hook`. 

```javascript
var cluster = require('cluster');
var sticky = require('sticky-session-custom');
var exitHook = require('async-exit-hook');

var server = require('http').createServer(function(req, res) {
  res.end('worker: ' + cluster.worker.id);
});

var closeMaster = sticky.listen(server, 3000);

if (closeMaster) {
  // Master code
  server.once('listening', function() {
    console.log('server started on 3000 port');
    setTimeout(function () {
      closeMaster(function () {
        console.log('Closed master!');
      }, false); // set to true if you want to wait for connections to close
    }, 2000);
  });
} else {
  // Worker code

  exitHook(function(done) {
    console.log('Worker received exit signal. Shutting down...');
    setTimeout(function() {
      console.log('shutdown');
      done();
    }, 3000);
  });
  
  // you can also send a shutdown signal to the master.
  // set to true if you want to wait for connections to close before
  // shutting down workers
  // process.send(['sticky:masterclose', false]);
}
```


## Multiple HTTP servers ##

```javascript
var cluster = require('cluster');
var sticky = require('sticky-session-custom');

var server1 = require('http').createServer(function (req, res) {
  res.end('from server1, worker: ' + cluster.worker.id);
});

var server2 = require('http').createServer(function (req, res) {
  res.end('from server2, worker: ' + cluster.worker.id);
});

var closeHandle = sticky.listen(server1, 3000);
sticky.listen(server2, 3001, '0.0.0.0', {
  // setting this to false will use workers of the first sticky instance spawned instead of
  // spawning more workers (only works if the amount of workers are the same)
  dontUseExistingWorkers: false
});

if (closeHandle) {
  // Master code
  server1.once('listening', function () {
    console.log('server started on 3000 port');
  });
  server2.once('listening', function () {
    console.log('server started on 3001 port');
  });
} else {
  // Worker code
}
```

## LICENSE

This software is licensed under the MIT License.

Copyright Simon Cheng, 2022.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.

[0]: http://socket.io/
[1]: http://nodejs.org/docs/latest/api/cluster.html
[2]: https://nodejs.org/api/net.html#net_net_createserver_options_connectionlistener
[3]: https://github.com/elad/node-cluster-socket.io
[4]: https://github.com/indutny/sticky-session/pull/45
