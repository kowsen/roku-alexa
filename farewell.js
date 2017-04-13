var prompt = require('./alexa')

var sayings = [
	"Have a cluckity cluck cluck day.",
	"Beginning playback.",
	"Enjoy your show.",
	"Have fun!",
	"Holla holla."
]

module.exports = function(id) {
	var saying = sayings[Math.floor(Math.random() * sayings.length)]
	prompt(saying, 'noresponse')
}