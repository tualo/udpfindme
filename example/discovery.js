var Discovery = require('..').Discovery;
var discovery = new Discovery(1234);
var serviceList = [];
discovery.on('found',function(data){
  serviceList.push(data);
});
discovery.on('timeout',function(data){
  console.log(serviceList);
});
discovery.discover();
