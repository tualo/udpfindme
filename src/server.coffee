{EventEmitter} = require 'events'
dgram = require 'dgram'
Message = require './message'

module.exports =
class Server extends EventEmitter
  constructor: (port,address) ->
    @port = port || 32000
    @message = '{ "t" : 1 }'
    @address = address || '0.0.0.0'
    @server = dgram.createSocket 'udp4'
    @server.on 'error', (err) => @onError(err)
    @server.on 'message', (msg, rinfo) => @onMessage(msg, rinfo)
    @server.on 'listening', () => @onListening()
    @server.bind(@port,@address)

  close: () ->
    @server.close()

  onError: (err) ->
    @emit 'error', err
    @server.close()

  onListening: ()->
    @emit 'listening'

  setMessage: (msg) ->
    @message = JSON.stringify msg , null, 0

  onMessage: (msg, rinfo) ->
    message = new Message msg
    if message.valid()
      if message.getMessage() == 'discover'
        responseMessage = (new Message @message).getBuffer()
        @server.send responseMessage,0, responseMessage.length,rinfo.port,rinfo.address, (err,bytes) ->
          true

      @emit 'message', message.getMessage() , rinfo
    else
