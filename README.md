## updfindme

`updfindme` is a client and server library for finding other services on a network. There for it uses upd4 broadcast datagrams for find services. All you have to do is to set one port number for communication.

# Usage

On the server side set up the message that tells something about your service.
```
var Server = require('updfindme').Server;
var server = new Server(1234);
server.setMessage({
  name: 'myservice',
  port: 9999,
  address: '127.0.0.1'
});
server.on('message',function(msg,remote){
  console.log('server',msg,remote);
})
```

All your clients can search the service information with:
```
var Client = require('updfindme').Client;
var client = new Client(1234);
client.on('found',function(data){
  console.log(data);
});
client.discover();
```

If you want to find all running services on all interfaces:
```
var Discovery = require('updfindme').Discovery;
var discovery = new Discovery(1234);
var serviceList = [];
discovery.on('found',function(data){
  serviceList.push(data);
});
discovery.on('timeout',function(data){
  console.log(serviceList);
});
discovery.discover();
```
