var fetchVideoInfo = require('youtube-info');
var Dj = /** @class */ (function () {
    function Dj(socketSession, db) {
        this.socketSession = socketSession;
        this.db = db;
        this.intervalId = -1;
    }
    Dj.prototype.ytVidId = function (url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : false;
    };
    Dj.prototype.processQueue = function (db, socketSession) {
        db.getNextQueueItem(socketSession.room._id)
            .then(function (data) {
            console.log(data);
            var queueItem = data.queueItem;
            console.log("processed queueItem and playing url: " + queueItem.playUrl);
            socketSession.emitToRoom('play', queueItem);
        })
            .catch(function (error) {
            console.log("error processing next queue item ");
            console.error(error);
        });
    };
    Dj.prototype.addQueueItem = function (queueItem, currentQueue) {
        var isFirst = currentQueue.length === 1;
        console.log("is first: " + isFirst);
        console.log(queueItem);
        // We only need to add the song on the first 
        if (isFirst) {
            this.addFirstQueueItem(this.db, this.socketSession);
            this.socketSession.emitToRoom('queue', currentQueue.splice(0));
        }
        else {
            this.socketSession.emitToRoom('queue', currentQueue);
        }
    };
    // expireQueueItemIfNotExpired() {
    // }
    /**
     * Handler called when all users in the room have requested the next track via the onEnd event
     *
     * Will pop the song off the current queue, and issue a play event for the new queueItem
     *
     */
    Dj.prototype.handleNextTrack = function () {
        var _this = this;
        this.db.popAndGetNextQueueItem(this.socketSession.room._id)
            .then(function (data) {
            // There was nothing left in the queue
            if (data === null) {
                _this.socketSession.emitToRoom('no_queue');
                return;
            }
            var queueItem = data.queueItem;
            var leftOverQueue = data.queue;
            // if we popped the last item (the leftOverQueue was null), then the queue is just the currently playing track
            if (leftOverQueue.length === 0) {
                leftOverQueue.push(queueItem);
            }
            console.log(leftOverQueue);
            _this.socketSession.emitToRoom('play', queueItem);
            _this.socketSession.emitToRoom('queue', leftOverQueue);
        })
            .catch(function (err) {
            console.log('Unable to get next queue item from the db');
        });
    };
    Dj.prototype.addFirstQueueItem = function (db, socketSession) {
        db.getNextQueueItem(socketSession.room._id)
            .then(function (queueItem) {
            console.log("processed queueItem and playing url: " + queueItem.playUrl);
            socketSession.emitToRoom('play', queueItem);
        })
            .catch(function (error) {
            console.log("error processing next queue item ");
            console.error(error);
        });
    };
    return Dj;
}());
module.exports = Dj;
//# sourceMappingURL=Dj.js.map