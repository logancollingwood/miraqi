const fetchVideoInfo = require('youtube-info');

class Dj {

    constructor(socketSession, db) {
        this.socketSession = socketSession;
        this.db = db;
        this.intervalId = -1;
    }

    ytVidId(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : false;
    }

    processQueue(db, socketSession) {
        db.getNextQueueItem(socketSession.room._id)
            .then(data => {
                console.log(data);
                let queueItem = data.queueItem;
                console.log(`processed queueItem and playing url: ${queueItem.playUrl}`);
                socketSession.emitToRoom('play', queueItem);
            })
            .catch(error => {
                console.log(`error processing next queue item `);
                console.error(error);
            })
    }

    addQueueItem(queueItem, currentQueue) {
        let isFirst = currentQueue.length == 1;
        console.log(`is first: ${isFirst}`);
        // We only need to add the song on the first 
        if (isFirst) {
            this.addFirstQueueItem(this.db, this.socketSession);
            this.socketSession.emitToRoom('queue', currentQueue.splice(0));
        } else {
            this.socketSession.emitToRoom('queue', currentQueue);
        }
    }

    /**
     * Handler called when all users in the room have requested the next track via the onEnd event
     * 
     * Will pop the song off the current queue, and issue a play event for the new queueItem
     * 
     */
    handleNextTrack(roomId) {
        this.db.popAndGetNextQueueItem(this.socketSession.room._id)
            .then((data) => {
                console.log(data);
                // There was nothing left in the queue
                if(data === null) {
                    this.socketSession.emitToRoom('no_queue');
                    return;
                }
                let queueItem = data.queueItem;
                let leftOverQueue = data.queue;
                
                // if we popped the last item (the leftOverQueue was null), then the queue is just the currently playing track
                if (leftOverQueue.length == 0) {
                    leftOverQueue.push(queueItem);
                }
                
                console.log(leftOverQueue);
                this.socketSession.emitToRoom('play', queueItem);
                this.socketSession.emitToRoom('queue', leftOverQueue);
             })
            .catch(err => {
                console.log('Unable to get next queue item from the db');
            })
    }

    addFirstQueueItem(db, socketSession) {
        db.getNextQueueItem(socketSession.room._id)
            .then(queueItem => {
                console.log(`processed queueItem and playing url: ${queueItem.playUrl}`);
                socketSession.emitToRoom('play', queueItem);
            })
            .catch(error => {
                console.log(`error processing next queue item `);
                console.error(error);
            })
    }

}

module.exports = Dj;