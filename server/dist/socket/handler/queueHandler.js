class QueueHandler {
    constructor(socket) {
        this.socket = socket;
        this.queue = [];
    }
    processQueue() {
        if (this.queue.length === 0) {
            return;
        }
        queueItem = queue[0];
        this.broadcastPlayMessage(queueItem);
    }
    queueYoutube(youtubeVideoId) {
        let queueItem = {
            type: 'yt',
            playId: youtubeVideoId
        };
        this.queue.push(queueItem);
        if (this.queue.length === 1) {
            this.processQueue();
        }
    }
    broadcastPlayMessage(queueItem) {
        //         this._io.to(this.room._id).emit('play', queueItem.playUrl);
    }
}
module.exports = QueueHandler;
//# sourceMappingURL=queueHandler.js.map