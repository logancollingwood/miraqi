const BeeQueue = require('bee-queue');
const MiraqiQueueWorker = require('./MiraqiQueueWorker');


class MiraqiQueue {

    constructor(io) {
        this._io = io;
        this._roomQueues = {};
    }


    async createQueue(queueName, request) {
        let {data, timestamp} = request;
        let roomId = data.roomId;
        const miraqiQueueWorker = new MiraqiQueueWorker(roomId, timestamp,);
        miraqiQueueWorker.createJob(data, timestamp);
        this._roomQueues.roomId = miraqiQueueWorker;
    }




}

module.exports = MiraqiQueue;