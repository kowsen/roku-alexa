var cache = require('./cache')

cache.setSearch('new girl', 123, 'series')
cache.setEpisodes(123, [{
	seasnum: '1',
	episodes: [
		{
			id: 54321,
			num: '1'
		},
		{
			id: 70196145,
			num: '3'
		}
	]
}])