var net = require('net');
var http = require('http');
var publicIp = require('public-ip')
var dynamo = require('./dynamo')

var IP_DB = 'roku_endpoint'
var ROKU_IP = "192.168.0.110";
var ROKU_PORT = 8060;
var PORT = 8042;
var secret = "nofatebutwhatwemake";

console.log('Starting Server on port ' + PORT);

net.createServer(function(socket) {
  socket.on('data', function(data) {
    var dataString = data.toString();
    var codeCheck = dataString.substring(0, secret.length);
    if (codeCheck === secret) {
      var id = dataString.substring(secret.length, dataString.length);
      handleID(id);
    }
    socket.end();
  });
  socket.on('error', function() {});
  socket.on('close', function() {});
}).listen(PORT);

function handleID(id) {
  var options = {
    hostname: ROKU_IP,
    port: ROKU_PORT,
    method: "POST",
    path: "/launch/12?mediaType=episode&contentID=" + id
  };
  console.log('Setting to id: ' + id);
  // http.request(options).end()
}

function setupIP() {
  publicIp.v4().then(function(ip) {
    console.log("Setting up ip to " + ip)
    var item = {
      "name": {
        "S": "roku"
      },
      "ip": {
        "S": ip
      },
      "port": {
        "N": "45045"
      }
    }
    dynamo.put(IP_DB, item)
  })
}

setupIP()