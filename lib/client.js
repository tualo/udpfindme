(function() {
  var Client, EventEmitter, Message, dgram,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = require('events').EventEmitter;

  dgram = require('dgram');

  Message = require('./message');

  module.exports = Client = (function(superClass) {
    extend(Client, superClass);

    function Client(port, broadcastAddress) {
      this.broadcastAddress = broadcastAddress || 'localhost';
      this.port = port || 32000;
      this.discoverMessage = new Message("discover");
    }

    Client.prototype.responseMessage = function(msg, remote) {
      var message;
      message = new Message(msg);
      if (message.valid()) {
        return this.emit('found', JSON.parse(message.getMessage()), remote);
      }
    };

    Client.prototype.onSend = function(err, bytes) {};

    Client.prototype.onListening = function() {
      var message;
      this.client.setBroadcast(true);
      message = this.discoverMessage.getBuffer();
      this.client.on('message', (function(_this) {
        return function(msg, remote) {
          return _this.responseMessage(msg, remote);
        };
      })(this));
      return this.client.send(message, 0, message.length, this.port, this.broadcastAddress, (function(_this) {
        return function(err, bytes) {
          return _this.onSend(err, bytes);
        };
      })(this));
    };

    Client.prototype.discover = function() {
      this.client = dgram.createSocket('udp4');
      this.client.on('listening', (function(_this) {
        return function() {
          return _this.onListening();
        };
      })(this));
      return this.client.bind();
    };

    return Client;

  })(EventEmitter);

}).call(this);
