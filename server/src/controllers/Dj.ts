import { JobQueueItem } from "../../../shared/model/JobQueueItem";
import QueueProcessor  from "../worker/QueueProcessor";

const fetchVideoInfo = require('youtube-info');
const db = require('../db/db');
class Dj {

    _socketSession: any;
    _queueProcessor: QueueProcessor;

    ytVidId(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : false;
    }

    processQueue() {
        db.getNextQueueItem()
            .then(data => {
                console.log(data);
                let queueItem = data.queueItem;
                console.log(`processed queueItem and playing url: ${queueItem.playUrl}`);
                this._socketSession.emitToRoom('play', queueItem);
            })
            .catch(error => {
                console.log(`error processing next queue item `);
                console.error(error);
            })
    }

    addQueueItem(queueItem, currentQueue) {
        let isFirst = currentQueue.length === 1;
        console.log(`is first: ${isFirst}`);
        console.log(queueItem);
        // We only need to add the song on the first 
        if (isFirst) {
            this.addFirstQueueItem(queueItem);
            this._socketSession.emitToRoom('queue', currentQueue.splice(0));
        } else {
            this._socketSession.emitToRoom('queue', currentQueue);
        }

    }

    /**
     * Handler called when all users in the room have requested the next track via the onEnd event
     * 
     * Will pop the song off the current queue, and issue a play event for the new queueItem
     * 
     */
    handleNextTrack() {
        db.popAndGetNextQueueItem(this._socketSession.room._id)
            .then((data) => {
                // There was nothing left in the queue
                if(data === null) {
                    this._socketSession.emitToRoom('no_queue');
                    return;
                }
                let queueItem = data.queueItem;
                let leftOverQueue = data.queue;
                
                // if we popped the last item (the leftOverQueue was null), then the queue is just the currently playing track
                if (leftOverQueue.length === 0) {
                    leftOverQueue.push(queueItem);
                }
                
                console.log(leftOverQueue);
                this._socketSession.emitToRoom('play', queueItem);
                this._socketSession.emitToRoom('queue', leftOverQueue);
             })
            .catch(err => {
                console.log('Unable to get next queue item from the db');
            })
    }

    addFirstQueueItem(queueItem) {
        let queueData: JobQueueItem = {
            queueItem: queueItem,
            roomId: this._socketSession.room._id,
        }
        console.log(`pushing onto queueProcessor`);
        console.log(queueData);
        this._queueProcessor.add(queueItem, { delay: 0 })
    }

}

module.exports = Dj;