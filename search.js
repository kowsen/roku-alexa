var prompt = require('./alexa')
var netflix = require('./netflix')
var cache = require('./cache')

module.exports = {
	// Should query our cache for the search term
	// If it's there, use that
	// If not, search Netflix
	// If we get an exact title match, populate cache and resolve
	// If not, ask through listing until user says yes, populate cache and resolve
	getData: function(searchTerm) {
		return cache.getSearch(searchTerm).then(function(payload) {
			if (payload) {
				return payload
			} else {
				return netflix.getSearch(searchTerm).then(function(data) {
					cache.setSearch(searchTerm, data)
					return {
						search: searchTerm,
						data: data
					}
				})
			}
		})
	},
	// Should query our cache for the show id
	// If it's there, use that
	// If not, search netflix, handle data, populate cache and resolve
	getEpisodes: function(id) {
		return cache.getEpisodes(id).then(function(payload) {
			if (payload) {
				return payload
			} else {
				return netflix.getEpisodes(id).then(function(data) {
					cache.setEpisodes(id, data)
					return {
						showid: id,
						data: data
					}
				})
			}
		})
	}
}