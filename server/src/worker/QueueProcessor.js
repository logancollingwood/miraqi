

class QueueProcessor {

    constructor(queue, io) {
        this._queue = queue;
        this._io = io;
        this._queue.process(this.process.bind(this));
    }

    async process(job, done) {
        const queueItem = job.data;
        console.log(job.data);
        console.log(`processing jobs: ${job.id}`);
        this._io.to(queueItem.roomId).emit('play', queueItem);
    }

    async add(data, opts) { 
        this._queue.add(data, opts);
    }
}


module.exports = QueueProcessor;