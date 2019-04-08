import { Queue, JobOptions, Job, DoneCallback } from "bull";
import { Server } from "socket.io";
import { QueueItem } from "../../../shared/model/QueueItem";
import DataBase  from "../db/db";
import { JobQueueItem } from "../../../shared/model/JobQueueItem";

export default class QueueProcessor {

    _queue: Queue;
    _io: Server;
    _db = DataBase;

    constructor(queue: Queue, io: Server) {
        this._queue = queue;
        this._io = io;
        this._queue.process(this.process.bind(this));
    }

    async process(job: Job, done: DoneCallback) {
        const jobQueueItem: JobQueueItem = job.data;
        console.log(job.data);
        console.log(`processing jobs: ${job.id}`);
        this._io.to(jobQueueItem.roomId).emit('play', jobQueueItem);
        const nextSongInSeconds: number = jobQueueItem.queueItem.lengthSeconds;
        const nextQueueItem: any = await this._db.getNextQueueItem(jobQueueItem.roomId);
        const nextQueueItemForJob: JobQueueItem = {
            roomId: jobQueueItem.roomId,
            queueItem: nextQueueItem
        }
        this.add(nextQueueItemForJob , {delay: nextSongInSeconds * 1000})
    }

    async add(data : JobQueueItem, opts: JobOptions) { 
        this._queue.add(data, opts);
    }
}