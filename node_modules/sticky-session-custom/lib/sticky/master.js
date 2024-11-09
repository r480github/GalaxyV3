'use strict';

var cluster = require('cluster');
var os = require('os');
var util = require('util');
var net = require('net');
var ip = require('ip');
var HTTPParser = require('http-parser-js').HTTPParser;

var debug = require('debug')('sticky:master');

/**
 * @typedef {object} MasterOptions
 * @property {null | string} proxyHeader
 * @property {null | (req: import('http-parser-js').HeaderInfo, socket: net.Socket) => number[]} generatePrehashArray
 * @property {null | (socket: net.Socket) => number[]} generatePrehashArrayNoParsing
 * @property {number} workers
 */

/**
 * @param {MasterOptions} options
 * @param {string | number} instanceId - used to keep track which http server the worker forwards the request to
 * @param {boolean?} useSharedWorkers - whether to avoid spawning workers (with reusing workers by this.workers = workers)
 */
function Master(options, instanceId, useSharedWorkers) {
  debug('master options=%j instanceId=%s useSharedWorkers=%s', options, instanceId, useSharedWorkers);

  if (!options) {
    options = {};
  }

  options.workers = options.workers || os.cpus().length;

  if (options.generatePrehashArray && options.proxyHeader) {
    throw new TypeError('cannot specify generatePrehashArray and proxyHeader options together');
  }
  if (options.generatePrehashArrayNoParsing && (options.proxyHeader || options.generatePrehashArray)) {
    throw new TypeError('proxyHeader or generatePrehashArray cannot be specified together with generatePrehashArrayNoParsing');
  }

  if (!options.generatePrehashArrayNoParsing) {
    options.generatePrehashArrayNoParsing = function (socket) {
      return ip.toBuffer(socket.remoteAddress || '127.0.0.1');
    };
  }
  if (!options.generatePrehashArray && options.proxyHeader) {
    options.generatePrehashArray = function (req, socket) {
      var address = socket.remoteAddress || '';

      for (var i = 0; i < req.headers.length; i += 2) {
        if (req.headers[i].toLowerCase() === options.proxyHeader) {
          address = (req.headers[i + 1] || '').trim().split(',')[0].trim() || address;
          break;
        }
      }
      debug('Proxy Address %j', address);

      try {
        return ip.toBuffer(address);
      } catch (e) {
        debug('cannot parse IP address %s', address);
      }
    };
  }

  if (options.generatePrehashArray)
    this.balance = this.balanceByRequestHeaders;
  else
    this.balance = this.balanceBySocket;

  net.Server.call(this, {
    pauseOnConnect: true
  }, this.balance);

  this.options = options;
  this.instanceId = instanceId;
  this.useSharedWorkers = useSharedWorkers;
  this.seed = (Math.random() * 0xffffffff) | 0;
  this.workers = [];
  this.masterConnections = [];
  this.totalConnections = 0;

  debug('master seed=%d', this.seed);

  var self = this;
  this.once('listening', function () {
    debug('master listening on %j', self.address());
    if (!useSharedWorkers)
      for (var i = 0; i < options.workers; i++)
        self.spawnWorker();
  });
}
util.inherits(Master, net.Server);
module.exports = Master;

Master.prototype.hash = function hash(data) {
  var hash = this.seed;
  for (var i = 0; i < data.length; i++) {
    var num = data[i];

    hash += num;
    hash %= 2147483648;
    hash += (hash << 10);
    hash %= 2147483648;
    hash ^= hash >> 6;
  }

  hash += hash << 3;
  hash %= 2147483648;
  hash ^= hash >> 11;
  hash += hash << 15;
  hash %= 2147483648;

  return hash >>> 0;
};

Master.prototype.spawnWorker = function spawnWorker() {
  var worker = cluster.fork();

  var self = this;
  worker.on('exit', function (code) {
    debug('worker=%d died with code=%d', worker.process.pid, code);
    if (!self._closing) {
      self.respawn(worker);
    } else {
      self._closing(worker.process.pid);
    }
  });
  worker.on('message', function (msg) {
    if (!msg.length || msg[0] !== 'sticky:masterclose')
      return;
    debug('received signal from worker to close master');
    if (!self._closing) {
      self.close(function () { }, !!msg[1]);
    } else {
      debug('refusing to close, as it is already closing/closed');
    }
  });

  debug('worker=%d spawn', worker.process.pid);
  this.workers.push(worker);
};

Master.prototype.respawn = function respawn(worker) {
  var index = this.workers.indexOf(worker);
  if (index !== -1)
    this.workers.splice(index, 1);
  this.spawnWorker();
};

Master.prototype.balanceBySocket = function balanceBySocket(socket) {
  debug('balancing by socket');
  var self = this;
  this.totalConnections++;
  socket.on('close', function () {
    self.totalConnections--;
  });

  var prehashArray = this.options.generatePrehashArrayNoParsing(socket);
  debug('got prehash array: %j', prehashArray);

  var workerId = this.hash(prehashArray) % this.workers.length;
  debug('sending to worker %d', this.workers[workerId].process.pid);

  this.workers[workerId].send(['sticky:balance', this.instanceId], socket);
};

Master.prototype.balanceByRequestHeaders = function balanceByRequestHeaders(socket) {
  debug('balancing by request headers');
  var self = this;
  socket.resume();
  self.totalConnections++;
  this.masterConnections.push(socket);

  var parser = new HTTPParser('REQUEST');
  parser.reinitialize(HTTPParser.REQUEST);

  var receivedChunks = [];

  function handler(buffer) {
    receivedChunks.push(buffer);
    parser.execute(buffer, 0, buffer.length);
  }
  socket.on('data', handler);

  var detachedFromMaster = function () {
    var idx = self.masterConnections.indexOf(socket);
    if (idx !== -1) self.masterConnections.splice(idx, 1);
    socket.off('data', handler);
  };
  socket.on('close', function () {
    self.totalConnections--;
    detachedFromMaster();
  });

  parser.onHeadersComplete = function (req) {
    parser.finish();
    socket.pause();

    var prehashArray = self.options.generatePrehashArray(req, socket);
    debug('got prehash array: %j', prehashArray);

    var workerId = self.hash(prehashArray) % self.workers.length;
    debug('sending to worker %d', self.workers[workerId].process.pid);

    detachedFromMaster();

    // Pass connection to worker
    // Pack the request with the message
    self.workers[workerId].send(['sticky:balance', self.instanceId, Buffer.concat(receivedChunks).toString('base64')], socket);
  };
};

Master.prototype.close = function (callback, waitForConnections) {
  if (this._closed) {
    throw new TypeError('master is already closed');
  }
  if (this._closing) {
    throw new TypeError('master is already closing');
  }

  debug('closing master. waitForConnections=%s', waitForConnections);

  var self = this;
  var countClosed = 0;
  this._closing = function (pid) {
    // worker will call this function when they are closed
    countClosed++;
    debug('closed worker %s. total closed: %s', pid, countClosed);
    if (self.workers.length === countClosed) {
      self._closed = true;
      debug('closed all workers');
      callback();
    }
  };

  var closeWorkers = function () {
    if (self.useSharedWorkers) {
      debug('current master instance is using shared workers. refusing to close workers.');
      callback();
      return;
    }
    debug('closing all workers');
    for (var i = 0; i < self.workers.length; i++) {
      if (self.workers[i].isConnected()) {
        self.workers[i].send(['sticky:close']);
      }
    }
  };

  debug('destroying %s connections to master', this.masterConnections.length);
  for (var i = 0; i < this.masterConnections.length; i++) {
    this.masterConnections[i].destroy();
  }

  debug('closing net socket server');
  net.Server.prototype.close.call(this, function (err) {
    if (err) throw err;
    if (waitForConnections) {
      closeWorkers();
    }
  });

  if (!waitForConnections) {
    closeWorkers();
  } else {
    debug('waiting for %s connections to close', this.totalConnections - this.masterConnections.length);
  }
};
