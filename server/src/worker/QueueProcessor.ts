import { Queue } from "bull";
import { Server } from "socket.io";
import { QueueItem } from "../../../shared/model/QueueItem";
import { DataBase } from "../db/db";

class QueueProcessor {

    _queue: Queue;
    _io: Server;

    constructor(queue: Queue, io: Server) {
        this._queue = queue;
        this._io = io;
        this._queue.process(this.process.bind(this));
    }

    async process(job, done) {
        const queueItem: QueueItem = job.data;
        console.log(job.data);
        console.log(`processing jobs: ${job.id}`);
        this._io.to(queueItem.roomId).emit('play', queueItem);
        const nextSongInSeconds: number = queueItem.lengthSeconds;


    }

    async add(data, opts) { 
        this._queue.add(data, opts);
    }
}


module.exports = QueueProcessor;