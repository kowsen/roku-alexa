var prompt = require('./alexa')
var search = require('./search')

function handleSearch(searchTerm, cb) {
	search.getData(searchTerm).then(function(payload) {
		if (payload.data.type === 'series') {
			handleSeries(payload.data, cb);
		} else {
			handleMovie(payload.data, cb);
		}
	})
}

function handleMovie(data, cb) {
	cb(data.id)
}

function handleSeries(data, cb) {
	prompt("Continue where you left off?", 'yesno').then(function(res) {
		if (res === 'yes') {
			cb(data.id)
		} else {
			getSeasonEpisode(data.id).then(getEpisodeID).then(cb)
		}
	})
}

function getSeasonEpisode(showID) {
	var promiseFunc = function(resolve, reject) {
		prompt("What season?", 'number').then(function(season) {
			prompt("What episode?", 'number').then(function(episode) {
				resolve({
					showID: showID,
					season: season,
					episode: episode
				})
			})
		})
	}
	return new Promise(promiseFunc)
}

function getEpisodeID(data) {
	var showID = data.showID
	var season = data.season
	var episode = data.episode
	var promiseFunc = function(resolve, reject) {
		search.getEpisodes(showID).then(function(payload) {
			var seasons = payload.data

			if (season == 0) {
				season = randomElem(seasons).seasnum
			}

			var seasonData = seasons[0]
			for (var i = 0; i < seasons.length; i++) {
				if (seasons[i].seasnum == season) {
					seasonData = seasons[i]
					break
				}
			}

			if (episode == 0) {
				episode = randomElem(seasonData.episodes).num
			}

			var episodeID = seasonData.episodes[0].id
			for (var j = 0; j < seasonData.episodes.length; j++) {
				if (seasonData.episodes[j].num == episode) {
					episodeID = seasonData.episodes[j].id
					break
				}
			}

			resolve(episodeID)
		})
	}
	return new Promise(promiseFunc)
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}

function randomElem(arr) {
	return arr[randomInt(0, arr.length)]
}

module.exports = handleSearch