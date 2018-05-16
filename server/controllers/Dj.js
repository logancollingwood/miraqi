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
        db.popQueue(socketSession.room._id)
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
            this.addFirstQueueItem(queueItem, currentQueue);
            this.socketSession.emitToRoom('queue', currentQueue.splice(0));
        } else {
            this.socketSession.emitToRoom('queue', currentQueue);
        }
    }

    addFirstQueueItem(queueItem, currentQueue) {
        this.intervalId = setTimeout(this.processQueue, 0, this.db, this.socketSession);
        console.log(`processing queue on interval: ${this.intervalId}`);
    }

}

module.exports = Dj;