"use strict";

var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test";
MongoClient.connect(uri, function(err, client) {
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   client.close();
});

var data = {
    "rooms": [{
        "id": "1",
        "name": "test room",
        "users": [{
            "userName": "test",
            "userId": 123,
            "isAdmin": true
        }, {
            "userName": "test2",
            "userId": 124,
            "isAdmin": false
        }]

    }]
};

function getRoomById(roomId) {
    console.log("Serving API request to find room with id: " + roomId);
    return data["rooms"].filter(function (i) {
        return i.id == roomId;
    });
}

module.exports = {
    getRoomById: getRoomById
};