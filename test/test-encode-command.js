

var hsocket = require('../bin/index.js');

var client = new hsocket.Client(9998, 9999);
//var id = Math.floor(Math.random()*100 + 1);
var id = 1;
var index = new hsocket.Index(id, 'test', null,
    ['time']);
console.log('id:', id);

client.openIndex(index, function() {
  client.insert([Date.now()], function() {
    console.log('END');
  }, console.error);
}, console.error);
