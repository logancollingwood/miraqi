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
        const { queueItem, queue }: any = await this._db.popAndGetNextQueueItem(jobQueueItem.roomId);

        console.log(queueItem);
        if (queueItem !== null) {
            this._io.to(jobQueueItem.roomId).emit(SocketMessageType.NEW_QUEUE, queue);
            this._io.to(jobQueueItem.roomId).emit('play', queueItem);
            const nextQueueItemForJob: JobQueueItem = {
                roomId: jobQueueItem.roomId,
                queueItem: queueItem
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