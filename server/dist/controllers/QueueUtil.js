class QueueUtil {
    getSecondsSinceTimestamp(timestamp) {
        var currentTimeSeconds = new Date().getTime() / 1000;
        var timstampSeconds = timestamp / 1000;
        return currentTimeSeconds - timestampSeconds;
    }
    getStartTimeForTimeInQueue(queue, durationInSeconds) {
        let timeUntilPlay = 0;
        queue.map((queueItem, index) => {
            if (index === 0) {
                timeUntilPlay += getSecondsSinceTimestamp(queueItem.inserDate);
                return;
            }
            timeUntilPlay += queueItem.lengthSeconds;
        });
        return timeUntilPlay;
    }
}
module.exports = new QueueUtil();
//# sourceMappingURL=QueueUtil.js.map