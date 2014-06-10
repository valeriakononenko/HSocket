

var hsocket = require('../bin/index.js');

var client = new hsocket.Client(9998, 9999);
//var id = Math.floor(Math.random()*100 + 1);
//var id = 2;
var index = new hsocket.Index('test', 'hsocket', ['time']);
console.log('id:', index.getId());

client.openIndex(index, function(result) {
  console.log('RESULT:', result);
  client.insert([13], function() {
    console.log('END');

  }, console.error);
}, console.error);
