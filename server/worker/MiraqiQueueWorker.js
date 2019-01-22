const BeeQueue = require('bee-queue');

class MiraqiQueueWorker {

    constructor(roomId, timestamp) {
        if (!roomId) {
            return {
                error: "No roomId specified"
            };
        }
        this._beeQueue = new BeeQueue(roomId);
        this._beeQueue.process((job, done) => {
            console.log(`Processing job ${job.id}`);
            return done(null);
        });
    }

    async createJob(data, delayTimestamp) {
        const job = this._beeQueue.createJob(data)
                                    .delayUntil(delayTimestamp)
                                    .save();
        job.on('succeeded', this.jobSucceeded.bind(this));
    }

    jobSucceeded(result) {
        console.log(`Received result: ${result}`);
    }


}

module.exports = MiraqiQueueWorker;