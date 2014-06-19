

var hsocket = require('../bin');

var count = 0;
var step = 1;
var id = 0;


var r = 0;
var e = 0;
var t = Date.now();
var mem = 0;


var client = new hsocket.Client(6379);
var index = new hsocket.Index('test', 't1', ['id', 'c0', 'c1'], 'col0');


function cancel() {
  e += 1;
  complete();
}


function complete() {
  mem += process.memoryUsage().heapUsed/1024/1024;

  if ((r += 1) === count) {
    console.log('[NODE-HSOCKET] | R:', r, ' | E:', e, ' | T:',
        Date.now() - t, ' | M:', (Math.round(mem/r*10)/10));
    run();
  }
}


function execInsert() {
  client.insert([id, id + 1, id - 1], complete, cancel);
  id += 1;
}


function execFind() {
  client.find(hsocket.OperationType.EQUALS, 2, complete(), cancel(),
      new hsocket.LIMIT(r, 0));
}


function run() {
  r = 0;
  e = 0;
  t = Date.now();
  mem = 0;
  count += step;

  if (count / step === 10) {
    step *= 10;
  }

  for (var i = 0; i < count; i += 1) {
    execInsert();
//    execFind();
  }
}


client.openIndex(index, run, function(error, code) {
  console.log('open_index error:', code, error)
});