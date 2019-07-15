"use strict";
exports.__esModule = true;
var fetchVideoInfo = require('youtube-info');
var db = require('../db/db');
var Dj = /** @class */ (function () {
    function Dj() {
    }
    Dj.prototype.ytVidId = function (url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : false;
    };
    Dj.prototype.processQueue = function () {
        var _this = this;
        db.getNextQueueItem()
            .then(function (data) {
            console.log(data);
            var queueItem = data.queueItem;
            console.log("processed queueItem and playing url: " + queueItem.playUrl);
            _this._socketSession.emitToRoom('play', queueItem);
        })["catch"](function (error) {
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
            this.addFirstQueueItem(queueItem);
            this._socketSession.emitToRoom('queue', currentQueue.splice(0));
        }
        else {
            this._socketSession.emitToRoom('queue', currentQueue);
        }
    };
    /**
     * Handler called when all users in the room have requested the next track via the onEnd event
     *
     * Will pop the song off the current queue, and issue a play event for the new queueItem
     *
     */
    Dj.prototype.handleNextTrack = function () {
        var _this = this;
        db.popAndGetNextQueueItem(this._socketSession.room._id)
            .then(function (data) {
            // There was nothing left in the queue
            if (data === null) {
                _this._socketSession.emitToRoom('no_queue');
                return;
            }
            var queueItem = data.queueItem;
            var leftOverQueue = data.queue;
            // if we popped the last item (the leftOverQueue was null), then the queue is just the currently playing track
            if (leftOverQueue.length === 0) {
                leftOverQueue.push(queueItem);
            }
            console.log(leftOverQueue);
            _this._socketSession.emitToRoom('play', queueItem);
            _this._socketSession.emitToRoom('queue', leftOverQueue);
        })["catch"](function (err) {
            console.log('Unable to get next queue item from the db');
        });
    };
    Dj.prototype.addFirstQueueItem = function (queueItem) {
        var queueData = {
            queueItem: queueItem,
            roomId: this._socketSession.room._id
        };
        console.log("pushing onto queueProcessor");
        console.log(queueData);
        this._queueProcessor.add(queueItem, { delay: 0 });
    };
    return Dj;
}());
module.exports = Dj;
