

var hsocket = require('../bin/index.js');

var client = new hsocket.Client(9998, 9999);
var index = new hsocket.Index('test', 'hs', ['id', 'c1', 'c2']);
index.setId(19);
console.log('id:', index.getId());

client.openIndex(index, function() {
  console.log('INDEX OK');
  client.insert([23, 1, 1], function() {
    console.log('INSERT 1 OK');
  }, function(error, code) {
    console.log('INSERT 1 ERROR:', code, error);
  });
}, function(error, code) {
  console.log('INDEX ERROR:', code, error);
});

