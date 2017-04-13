var dynamo = require('./dynamo')

var SEARCH_DB = 'netflix_search'
var EPISODE_DB = 'netflix_episodes'

module.exports = {
	getSearch: function(searchTerm) {
		var key = {
			"search": {
				"S": searchTerm
			}
		}
		return dynamo.get(SEARCH_DB, key).then(function(data) {
			if (data && data.data) {
				data.data = JSON.parse(data.data)
			}
			return data
		})
	},
	setSearch: function(searchTerm, data) {
		var item = {
			"search": {
				"S": searchTerm
			},
			"data": {
				"S": JSON.stringify(data)
			}
		}
		return dynamo.put(SEARCH_DB, item)
	},
	getEpisodes: function(showID) {
		var key = {
			"showid": {
				"N": "" + showID
			}
		}
		return dynamo.get(EPISODE_DB, key).then(function(data) {
			if (data && data.data) {
				data.data = JSON.parse(data.data)
			}
			return data
		})
	},
	setEpisodes: function(showID, episodes) {
		var item = {
			"showid": {
				"N": "" + showID
			},
			"data": {
				"S": JSON.stringify(episodes)
			}
		}
		return dynamo.put(EPISODE_DB, item)
	}
}