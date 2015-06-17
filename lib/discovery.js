(function() {
  var Client, Discovery, EventEmitter, dgram, os,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = require('events').EventEmitter;

  dgram = require('dgram');

  Client = require('./client');

  os = require('os');

  Array.prototype.merge = function(other) {
    return Array.prototype.push.apply(this, other);
  };

  module.exports = Discovery = (function(superClass) {
    extend(Discovery, superClass);

    function Discovery(port, timeout) {
      var ifaces;
      this.port = port || 32000;
      this.timeout = timeout || 5000;
      this.broadcastAddresses = [];
      ifaces = os.networkInterfaces();
      this.addresses(this.fromInterfaces(ifaces));
    }

    Discovery.prototype.fromInterfaces = function(ifaces) {
      var addresses, i, item, len, list, name;
      addresses = [];
      for (name in ifaces) {
        addresses.merge(this.filterIP4(ifaces[name]));
      }
      list = [];
      for (i = 0, len = addresses.length; i < len; i++) {
        item = addresses[i];
        list.push(item.address.split('.').slice(0, 3).join('.') + '.255');
      }
      return list;
    };

    Discovery.prototype.filterIP4 = function(arr) {
      var i, item, len, result;
      result = [];
      for (i = 0, len = arr.length; i < len; i++) {
        item = arr[i];
        if (item.family === 'IPv4') {
          result.push(item);
        }
      }
      return result;
    };

    Discovery.prototype.addresses = function(list) {
      return this.broadcastAddresses = list;
    };

    Discovery.prototype.discover = function(index) {
      var address, client;
      if (typeof index === 'undefined') {
        index = 0;
      }
      if (index < this.broadcastAddresses.length) {
        address = this.broadcastAddresses[index];
        if (address === '127.0.0.255') {
          address = 'localhost';
        }
        client = new Client(this.port, address);
        client.on('found', (function(_this) {
          return function(data) {
            return _this.onFound(data);
          };
        })(this));
        client.discover();
        return this.discover(index + 1);
      } else {
        return this.resetTimeout();
      }
    };

    Discovery.prototype.resetTimeout = function() {
      if (this.timeout > 0) {
        if (this.timer != null) {
          clearTimeout(this.timer);
        }
        return this.timer = setTimeout(this.onTimeout.bind(this), this.timeout);
      }
    };

    Discovery.prototype.onTimeout = function() {
      return this.emit('timeout');
    };

    Discovery.prototype.onFound = function(data) {
      return this.emit('found', data);
    };

    return Discovery;

  })(EventEmitter);

}).call(this);
