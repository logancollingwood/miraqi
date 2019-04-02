var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class QueueProcessor {
    constructor(queue, io) {
        this._queue = queue;
        this._io = io;
        this._queue.process(this.process.bind(this));
    }
    process(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const queueItem = job.data;
            console.log(job.data);
            console.log(`processing jobs: ${job.id}`);
            this._io.to(queueItem.roomId).emit('play', queueItem);
        });
    }
    add(data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            this._queue.add(data, opts);
        });
    }
}
module.exports = QueueProcessor;
//# sourceMappingURL=QueueProcessor.js.map