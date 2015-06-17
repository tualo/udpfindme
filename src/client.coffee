{EventEmitter} = require 'events'
dgram = require 'dgram'
Message = require './message'

module.exports =
class Client extends EventEmitter
  constructor: (port,broadcastAddress) ->
    @broadcastAddress = broadcastAddress || 'localhost'
    @port = port || 32000
    @discoverMessage = new Message "discover"

  responseMessage: (msg, remote) ->
    message = new Message msg
    if message.valid()
      @emit 'found', JSON.parse(message.getMessage()), remote

  onSend: (err,bytes) ->

  onListening: () ->
    @client.setBroadcast true
    message = @discoverMessage.getBuffer()
    @client.on 'message', (msg, remote) => @responseMessage(msg, remote)
    @client.send message,0,message.length,@port,@broadcastAddress, (err,bytes) => @onSend(err,bytes)

  discover: () ->
    @client = dgram.createSocket 'udp4'
    @client.on 'listening', () => @onListening()
    @client.bind()
