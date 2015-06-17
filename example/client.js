var Client = require('..').Client;
var client = new Client(1234);
client.on('found',function(data){
  console.log(data);
});
client.discover();
