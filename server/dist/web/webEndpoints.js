'use strict';

function setupWebEndpoints(app, db) {
    app.get('/api/room/:id', function (req, res) {
        db.getRoomById(req.params.id).then(function (room) {
            console.log('returning room with id: ' + room._id);
            res.json(room);
        }).catch(function (error) {
            console.error("API CALL FAILED: Failed to find room with id" + req.params.id);
            res.json({});
        });
    });

    app.post('/api/room', function (req, res) {
        db.createRoom(req.body).then(function (room) {
            console.log('successfully created room with name: ' + room.name);
            console.log(room);
            res.json(room);
        }).catch(function (error) {
            console.error("API CALL FAILED: Failed to create room with name" + req.params.name);
            res.sendStatus(500);
        });
    });

    app.get('/api/user/:id', function (req, res) {
        db.getUserById(req.params.id).then(function (user) {
            console.log('returning user with id: ' + user._id);
            res.json(user);
        }).catch(function (error) {
            res.json({});
        });
    });

    app.post('/api/user', function (req, res) {
        console.log(req.body);
        db.createUser(req.body.name, false).then(function (user) {
            console.log('successfully created user with name: ' + user.name);
            res.json(user);
        }).catch(function (error) {
            console.error("API CALL FAILED: Failed to create user with name" + req.body.name);
            res.sendStatus(500);
        });
    });

    app.post('/api/room/adduser', function (req, res) {
        console.log(req.body);
        db.addUserToRoom(req.body).then(function (response) {
            console.log('successfully added user with name: ' + response.user.name + ' to room: ' + response.room._id);
            res.json(response);
        }).catch(function (error) {
            console.error("API CALL FAILED: Failed to add user with userid " + req.body.userId + ' to room' + req.body.roomId);
            res.sendStatus(500);
        });
    });

    app.post('/api/room/removeuser', function (req, res) {
        console.log(req.body);
        db.removeUserFromRoom(req.body).then(function (response) {
            console.log('successfully removed user with name: ' + response.userName + ' from room: ' + response.roomId);
            res.json(response);
        }).catch(function (error) {
            console.error("API CALL FAILED: Failed to remove user with userid " + req.body.userId + ' from room' + req.body.roomId);
            res.sendStatus(500);
        });
    });

    /**
     * POST: {
     *  url: url,
     *  userId: User Id of Requester
     * }
     */
    app.post('/api/room/queueItem', function (req, res) {
        console.log('Adding queue item');
        console.log(req.body);
        db.addQueueItem(req.body).then(function (room) {
            console.log(room);
            console.log('successfully added queue item with url ' + room.name + ' to room: ' + room._id);
            res.json(room);
        }).catch(function (error) {
            console.error("API CALL FAILED: Failed to queue url " + req.body.url + ' to room ' + req.body.roomId);
            res.sendStatus(500);
        });
    });

    app.post('/api/room/addMessageToRoom', function (req, res) {
        console.log('Adding message item');
        console.log(req.body);
        var request = req.body;
        db.addMessageToRoom(request.roomId, request.userId, request.msg).then(function (room) {
            console.log('hi');
            console.log(room);
            console.log('successfully added message item with msg ' + req.body.msg + ' to room: ' + room._id);
            res.json(room);
        }).catch(function (error) {
            console.error("API CALL FAILED: Failed add message " + req.body.msg + ' to room ' + req.body.roomId);
            res.sendStatus(500);
        });
    });

    app.post('/api/room/clearqueue', function (req, res) {
        console.log('clearing queue for room ' + req.body.roomId + ' for user ' + req.body.userId);
        db.clearQueue(req.body.roomId, req.boody.userId).then(function (room) {
            res.json(room);
        }).catch(function (error) {
            console.error("API CALL FAILED: Failed to queue url " + req.body.url + ' to room ' + req.body.roomId);
            res.sendStatus(500);
        });
    });
}

module.exports = setupWebEndpoints;