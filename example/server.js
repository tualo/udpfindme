var Server = require('..').Server;
var server = new Server(1234);
server.setMessage({
  name: 'myservice',
  post: 9999,
  address: '127.0.0.1'
});
server.on('message',function(msg,remote){
  console.log('server',msg,remote);
})
