var net = require('net');
var dynamo = require('./dynamo')
var farewell = require('./farewell')

var IP_DB = 'roku_endpoint'
var secret = "nofatebutwhatwemake";

function getIP() {
	var key = {
		"name": {
			"S": "roku"
		}
	}
	return dynamo.get(IP_DB, key)
}

module.exports = function(id) {
	getIP().then(function(data) {
		var client = new net.Socket();
		client.connect(parseInt(data.port), data.ip, function() {
			console.log(secret + id);
			client.write(secret + id);
			client.end();
			farewell(id)
			process.exit(-1)
		})
	})
}