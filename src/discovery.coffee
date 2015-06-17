{EventEmitter} = require 'events'
dgram = require 'dgram'
Client = require './client'
os = require 'os'
Array::merge = (other) -> Array::push.apply @, other

module.exports =
class Discovery extends EventEmitter
  constructor: (port,timeout) ->
    @port = port || 32000
    @timeout = timeout || 5000
    @broadcastAddresses = []
    ifaces = os.networkInterfaces()
    @addresses @fromInterfaces(ifaces)



  fromInterfaces: (ifaces) ->


    addresses = []
    (addresses.merge(@filterIP4(ifaces[name])) for name of ifaces)
    list = []
    ( list.push( item.address.split('.').slice(0,3).join('.') + '.255' ) for item in addresses)
    list

  filterIP4: (arr) ->
    result = []
    (result.push(item) for item in arr when item.family == 'IPv4')
    result

  addresses: (list) ->
    @broadcastAddresses = list


  discover: (index) ->

    if typeof index=='undefined'
      index=0
    if index < @broadcastAddresses.length
      address = @broadcastAddresses[index]
      if address == '127.0.0.255'
        address = 'localhost'
      client = new Client @port, address
      client.on 'found', (data,remote) => @onFound(data,remote)
      client.discover()
      @discover index+1
    else
      @resetTimeout()

  resetTimeout: () ->
    if @timeout > 0
      if @timer?
        clearTimeout @timer
      @timer = setTimeout @onTimeout.bind(@), @timeout

  onTimeout: () ->
    @emit 'timeout'

  onFound: (data,remote) ->
    @emit 'found', data, remote
