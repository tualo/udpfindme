(function() {
  var EventEmitter, Message, Server, dgram,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = require('events').EventEmitter;

  dgram = require('dgram');

  Message = require('./message');

  module.exports = Server = (function(superClass) {
    extend(Server, superClass);

    function Server(port, address) {
      this.port = port || 32000;
      this.message = '{ "t" : 1 }';
      this.address = address || '127.0.0.1';
      this.server = dgram.createSocket('udp4');
      this.server.on('error', (function(_this) {
        return function(err) {
          return _this.onError(err);
        };
      })(this));
      this.server.on('message', (function(_this) {
        return function(msg, rinfo) {
          return _this.onMessage(msg, rinfo);
        };
      })(this));
      this.server.on('listening', (function(_this) {
        return function() {
          return _this.onListening();
        };
      })(this));
      this.server.bind(this.port, this.address);
    }

    Server.prototype.close = function() {
      return this.server.close();
    };

    Server.prototype.onError = function(err) {
      this.emit('error', err);
      return this.server.close();
    };

    Server.prototype.onListening = function() {
      return this.emit('listening');
    };

    Server.prototype.setMessage = function(msg) {
      return this.message = JSON.stringify(msg, null, 0);
    };

    Server.prototype.onMessage = function(msg, rinfo) {
      var message, responseMessage;
      message = new Message(msg);
      if (message.valid()) {
        if (message.getMessage() === 'discover') {
          responseMessage = (new Message(this.message)).getBuffer();
          this.server.send(responseMessage, 0, responseMessage.length, rinfo.port, rinfo.address, function(err, bytes) {
            return true;
          });
        }
        return this.emit('message', message.getMessage(), rinfo);
      } else {

      }
    };

    return Server;

  })(EventEmitter);

}).call(this);
