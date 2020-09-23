import { Queue, JobOptions, Job, DoneCallback } from "bull";
import { Server } from "socket.io";
import { QueueItem } from "../../../shared/model/QueueItem";
import DataBase from "../db/db";
import { JobQueueItem } from "../../../shared/model/JobQueueItem";
import SocketMessageType from './../../../shared/model/entity/SocketMessageType';

export default class QueueProcessor {

    private _queue: Queue;
    private _io: Server;
    private _db = DataBase;

    constructor(queue: Queue, io: Server) {
        this._queue = queue;
        this._io = io;
        this._queue.process(this.process.bind(this));
    }

    async process(job: Job) {
        console.log(`processing queue`);
        const jobQueueItem: JobQueueItem = job.data;
        const currentQueue: any = await this._db.getQueue(jobQueueItem.roomId)
        if (currentQueue.queue.length === 1) {
            if (jobQueueItem.queueItemThatHasBeenPlayed.trackName !== currentQueue[0].trackName) {
                console.log("Queue item was skipped before next pop, continuing");
                return;
            }
        }

        const { queueItem, queue }: any = await this._db.popAndGetNextQueueItem(jobQueueItem.roomId);
        // somehow handle skipped case, in case our skip pops ahead
        

        console.log(queueItem);

        // if our next item is not null
        // and (for the skipped item case) the next queue item has a different ID then what is currently being played 
        // because the case exists where we enter this function when the next item has already been played(jobQueueItem) (because it was skipped since registering the queue item skipped)
        // so the paremeter to this function and the current top of the queue are different
        console.log(`${queueItem._id}  queueItemId: callbackParameter Id :${jobQueueItem.queueItemThatHasBeenPlayed.id}`);
        if (queueItem !== null && queueItem._id !== jobQueueItem.queueItemThatHasBeenPlayed.id) {
            this._io.to(jobQueueItem.roomId).emit(SocketMessageType.NEW_QUEUE, queue);
            this._io.to(jobQueueItem.roomId).emit('play', queueItem);
            const nextQueueItemForJob: JobQueueItem = {
                roomId: jobQueueItem.roomId,
                queueItemThatHasBeenPlayed: queueItem
            }
            this.add(nextQueueItemForJob, { delay: queueItem.lengthSeconds * 1000 })
        } else {
            this._io.to(jobQueueItem.roomId).emit(SocketMessageType.NO_QUEUE, {});
            this._io.to(jobQueueItem.roomId).emit(SocketMessageType.NOW_PLAYING, {})
            console.log(`drained queue for room: ${jobQueueItem.roomId}`);
        }
    }

    add(data: JobQueueItem, opts: JobOptions) {
        console.log(`adding in processor`);
        console.log(data);
        console.log(`adding queueItem ${data.queueItem.trackName} to room: ${data.roomId} to be played in ${opts.delay} seconds`);
        this._queue.add(data, opts);
    }
}