var http = require('http');

var start_block = parseInt(process.argv[2]);
var end_block = parseInt(process.argv[3]);
var acc = process.argv[4];

var max = -1;

var timestamp;

function get_max(block_num) {
  if (block_num == start_block-1) {
    console.log(max);
    console.log("Latency: "+((new Date().getTime()-timestamp)/1000)+" sec");
    process.exit();
  }
  if (block_num % 1000 == 0) {
    console.log("checking: "+block_num);
  }

  var post_data = JSON.stringify({
    "jsonrpc": "2.0",
      "method": "eth_getBalance",
      "params": 
    [acc, block_num.toString()],
      "id": 3
  });

  var post_options = {
    hostname: 'localhost',
    port    : '8545',
    method  : 'POST',
    headers : {
      'Content-Type': 'application/json'
    }
  };

  var post_req = http.request(post_options, function (res) {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function(){
      // console.log("timestamp: "+(new Date().getTime()));
      ret = JSON.parse(body).result;
      max = max > ret ? max : ret;
      get_max(block_num-1);
    });
  });

  post_req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  post_req.write(post_data);
  post_req.end();
}

timestamp = new Date().getTime();
get_max(end_block);
