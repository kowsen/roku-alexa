var readline = require('readline')
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

// Should send text to be read by alexa
// Should resolve with the response
// responseTypes are 'number', 'yesno', and 'noresponse'
// number: unrecognized -> 0
// yesno: "yes" or "no"
// noresponse: resolve immediately
module.exports = function(text, responseType) {
	return new Promise(function(resolve) {
		if(responseType === 'noresponse') {
			console.log(text)
			resolve()
		} else {
			rl.question(text, function(answer) {
				resolve(answer)
			})
		}
	})
}