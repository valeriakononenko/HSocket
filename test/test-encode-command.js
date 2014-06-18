

var hsocket = require('../bin/index.js');

var client = new hsocket.Client(9998, 9999);
var index = new hsocket.Index('test', 'hs', ['id', 'c1', 'c2']);
console.log('id:', index.getId());

client.openIndex(index, function() {
  console.log('INDEX OK');

//  var limit = hsocket.constraints.LIMIT(10, 0);
//  client.find('=', [1], function(result) {
//    console.log('FIND OK', result);
//  }, function(error, code) {
//    console.log('FIND ERROR:', code, error);
//  }, limit);

  client.delete('=', [2], function(result) {
    console.log('DELETE OK', result);
  }, function(error, code) {
    console.log('DELETE ERROR:', code, error);
  })


}, function(error, code) {
  console.log('INDEX ERROR:', code, error);
});

