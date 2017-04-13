var AWS = require('aws-sdk')
AWS.config.loadFromPath('./credentials.json')
var dynamo = new AWS.DynamoDB();

module.exports = {
    put: function(tableName, data) {
        return new Promise(function(resolve) {
            dynamo.putItem({
                "TableName": tableName,
                "Item": data
            }, function(err, data) {
                resolve(data)
            })
        })
    },
    get: function(tableName, key) {
        return new Promise(function(resolve) {
            dynamo.getItem({
                "TableName": tableName,
                "Key": key
            }, function(err, data) {
                if (data && data.Item) {
                    var trimData = {}
                    for (var key in data.Item) {
                        var item = data.Item[key]
                        item = item[Object.keys(item)[0]]
                        trimData[key] = item
                    }
                    resolve(trimData)
                } else {
                    resolve(false)
                }
            })
        })
    },
    delete: function(tableName, key) {
        return new Promise(function(resolve) {
            dynamo.deleteItem({
                "TableName": tableName,
                "Key": key
            }, function(err, data) {
                resolve(data)
            })
        })
    }
}