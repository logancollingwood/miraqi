var QueueHandler = /** @class */ (function () {
    function QueueHandler(socket) {
        this.socket = socket;
        this.queue = [];
    }
    QueueHandler.prototype.processQueue = function () {
        if (this.queue.length === 0) {
            return;
        }
        queueItem = queue[0];
        this.broadcastPlayMessage(queueItem);
    };
    QueueHandler.prototype.queueYoutube = function (youtubeVideoId) {
        var queueItem = {
            type: 'yt',
            playId: youtubeVideoId
        };
        this.queue.push(queueItem);
        if (this.queue.length === 1) {
            this.processQueue();
        }
    };
    QueueHandler.prototype.broadcastPlayMessage = function (queueItem) {
        //         this._io.to(this.room._id).emit('play', queueItem.playUrl);
    };
    return QueueHandler;
}());
module.exports = QueueHandler;
//# sourceMappingURL=queueHandler.js.map