'use strict';

var os = require('os');
var cluster = require('cluster');
var debug = require('debug')('sticky:worker');

var Master = require('./master');

var firstMaster = null;
var masterInstances = 0;
var servers = {};
var didAttachListener = false;

/**
 * @param {import('http').Server} server
 * @param {number} port
 * @param {string?} hostname
 * @param {(import('./master').MasterOptions & {dontUseExistingWorkers: boolean})?} options
 * @returns {null | (callback: () => void, waitForConnections?: boolean) => void} - close handle
 */
function listen(server, port, hostname, options) {
  // keep track of which server to forward to
  var instanceId = ++masterInstances;
  servers[instanceId] = server;

  options = Object.assign({}, options);

  options.workers = options.workers || os.cpus().length;

  var useExistingWorkers = firstMaster && firstMaster.options.workers === options.workers && !options.dontUseExistingWorkers;

  if (cluster.isMaster) {
    var master = new Master(options, instanceId, useExistingWorkers);

    if (useExistingWorkers) {
      master.workers = firstMaster.workers;
    }
    if (firstMaster) {
      master.seed = firstMaster.seed;
    } else {
      firstMaster = master;
    }

    master.listen(port, hostname);
    master.once('listening', function () {
      server.emit('listening');
    });
    return master.close.bind(master);
  }

  // prevent attaching message listener to worker multiple times if there are multiple servers
  if (!didAttachListener) {
    didAttachListener = true;
    process.on('disconnect', function() {
      debug('parent got disconnected');
      process.exit();
    });
    process.on('message', function (msg, socket) {
      if (!msg.length)
        return;
      if (msg[0] === 'sticky:close') {
        debug('received exit request from master process');
        if (process._events.SIGINT) {
          debug('SIGINT listener exists. calling process.emit(\'SIGINT\')');
          process.emit('SIGINT');
        } else {
          debug('SIGINT listener does not exit. calling process.exit()');
          process.exit();
        }
        return;
      }
      if (msg[0] !== 'sticky:balance' || !socket)
        return;
      if (msg[1])
        server = servers[msg[1]];

      debug('incoming socket');
      server._connections++;
      socket.server = server;

      // reappend the buffer
      if (msg[2]) {
        socket.unshift(Buffer.from(msg[2], 'base64'));
      }

      server.emit('connection', socket);
      socket.resume();
    });
  }

  return null;
}
exports.listen = listen;
