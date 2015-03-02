

var hsocket = require('../bin/index.js');

var client = new hsocket.Client(9998, 9999);
var index = new hsocket.Index('test', 't1', ['id', 'c0', 'c1'], 'col0');
console.log('id:', index.getId());

client.openIndex(index, function() {
  console.log('INDEX OK');
  client.insert([8, 8, 6], function(result) {
    console.log('INSERT OK', result);
    client.find(hsocket.protocol.Op.EQUALS, 2, function(result) {
      console.log('FIND OK', result);
      client.delete(hsocket.protocol.Op.EQUALS, 2, function(result) {
        console.log('DELETE OK', result);
      }, function(error, code) {
        console.log('DELETE ERROR:', error, code);
      }, new hsocket.LIMIT(10, 0));
    }, function(error, code) {
      console.log('FIND ERROR:', error, code);
    }, new hsocket.LIMIT(10, 0));
  }, function(error, code) {
    console.log('INSERT ERROR:', error, code);
  });
}, function(error, code) {
  console.log('INDEX ERROR:', error, code);
});

