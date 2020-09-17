import { JobQueueItem } from "../../../shared/model/JobQueueItem";
import QueueProcessor from "../worker/QueueProcessor";
import db from "../db/db";
import { QueueItem } from './../../../shared/model/QueueItem';
import SocketMessageType from './../../../shared/model/entity/SocketMessageType';
var moment = require('moment')

class Dj {
  constructor(socketSession, queueProcessor) {
    this._socketSession = socketSession;
    this._queueProcessor = queueProcessor;
  }

  _socketSession: any;
  _queueProcessor: QueueProcessor;

  ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(p) ? RegExp.$1 : false;
  }

  processQueue() {
    db.getNextQueueItem(this._socketSession.room._id)
      .then((data: any) => {
        console.log(data);
        let queueItem = data.queueItem;
        console.log(
          `processed queueItem and playing url: ${queueItem.playUrl}`
        );
        this._socketSession.emitToRoom("play", queueItem);
      })
      .catch(error => {
        console.log(`error processing next queue item `);
        console.error(error);
      });
  }

  addQueueItem(queueItem, currentQueue) {
    // on the first item in the queue, we trigger an immediate play and
    // set a delayed timer at the end of the item to drain the queue and play next
    // on second or more items, we just add it to the queue and wait for the prior triggered delay
    if (currentQueue.length === 1) {
      this._socketSession.emitToRoom(SocketMessageType.NEW_QUEUE, currentQueue.splice(0));
      this._socketSession.emitToRoom("play", queueItem)

      this.addItemToDelayQueue(queueItem, (queueItem.lengthSeconds*1000) + 1000);
    } else {
      this._socketSession.emitToRoom(SocketMessageType.NEW_QUEUE, currentQueue.splice(0));
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
      .then((data: any) => {
        // There was nothing left in the queue
        if (data === null || data.queue === null || data.queue.length === 0) {
          this._socketSession.emitToRoom(SocketMessageType.NO_QUEUE);
          return;
        }
        let queueItem = data.queueItem;
        let leftOverQueue = data.queue;

        // if we popped the last item (the leftOverQueue was null), then the queue is just the currently playing track
        if (leftOverQueue.length === 0) {
          leftOverQueue.push(queueItem);
        }

        console.log(leftOverQueue);
        this._socketSession.emitToRoom("play", queueItem);
        this._socketSession.emitToRoom(SocketMessageType.NEW_QUEUE, leftOverQueue);
      })
      .catch(err => {
        console.log("Unable to get next queue item from the db");
        console.log(err);
      });
  }

  addItemToDelayQueue(queueItem, delay) {
    let queueData: JobQueueItem = {
      queueItem: queueItem,
      roomId: this._socketSession.room._id
    };

    console.log(`pushing onto queueProcessor`);
    this._queueProcessor.add(queueData, {
      delay: delay
    });
  }
}

module.exports = Dj;
