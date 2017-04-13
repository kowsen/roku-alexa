var unirest = require('unirest')
var prompt = require('./alexa')

function constructData(rawData) {
	return {
		id: rawData[0],
		type: rawData[6]
	}
}

function constructEpisodes(rawEpisodes) {
	return rawEpisodes.map(function(season) {
		return {
			seasnum: season.seasnum,
			episodes: season.episodes.map(function(episode) {
				return {
					id: episode.episode[0],
					num: episode.episode[2]
				}
			})
		}
	})
}

function getDefaultEpisodes(showid) {
	return [{
		seasnum: '1',
		episodes: [{
			id: showid,
			num: '1'
		}]
	}]
}

function makeSelection(shows) {
	return new Promise(function(resolve) {
		var handleShow = function(i) {
			var title = shows[i][1]
			prompt('Are you looking for ' + title + '?', 'yesno').then(function(response) {
				if (response === 'yes') {
					var data = constructData(shows[i])
					resolve(data)
				} else {
					handleShow(i + 1)
				}
			})
		}
		handleShow(0)
	})
}

module.exports = {
	// Search netflix
	// If exact title match (minus specials, spaces, and 'the') use that
	// else go through array using prompt to ask if we want it
	// "Are you looking for [X}?"
	getSearch: function(searchTerm) {
		return new Promise(function(resolve) {
			unirest.get("https://unogs-unogs-v1.p.mashape.com/api.cgi?q=" + searchTerm + "-!1900,2017-!0,5-!0,10-!0-!Any-!Any-!Any-!gt100&t=ns&cl=all&st=adv&ob=Relevance&p=1&sa=and")
			.header("X-Mashape-Key", "nY7TS1K3dGmshZeb44tGheOyGbl3p1GcCDJjsnUErghSk1Yf7t")
			.header("Accept", "application/json")
			.end(function (result) {
				makeSelection(result.body.ITEMS).then(resolve)
			});
		})
	},
	// Search netflix
	// If doesn't exist, use getDefaultEpisodes
	getEpisodes: function(showid) {
		return new Promise(function(resolve) {
			unirest.get("https://unogs-unogs-v1.p.mashape.com/api.cgi?t=episodes&q=" + showid)
			.header("X-Mashape-Key", "nY7TS1K3dGmshZeb44tGheOyGbl3p1GcCDJjsnUErghSk1Yf7t")
			.header("Accept", "application/json")
			.end(function (result) {
				if (result && result.body && result.body.RESULTS) {
					resolve(constructEpisodes(result.body.RESULTS))
				} else {
					resolve(getDefaultEpisodes(showid))
				}
			});
		})
	}
}