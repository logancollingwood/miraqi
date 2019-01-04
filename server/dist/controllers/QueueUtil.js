var QueueUtil = /** @class */ (function () {
    function QueueUtil() {
    }
    QueueUtil.prototype.getSecondsSinceTimestamp = function (timestamp) {
        var currentTimeSeconds = new Date().getTime() / 1000;
        var timstampSeconds = timestamp / 1000;
        return currentTimeSeconds - timestampSeconds;
    };
    QueueUtil.prototype.getStartTimeForTimeInQueue = function (queue, durationInSeconds) {
        var timeUntilPlay = 0;
        queue.map(function (queueItem, index) {
            if (index === 0) {
                timeUntilPlay += getSecondsSinceTimestamp(queueItem.inserDate);
                return;
            }
            timeUntilPlay += queueItem.lengthSeconds;
        });
        return timeUntilPlay;
    };
    return QueueUtil;
}());
module.exports = new QueueUtil();
//# sourceMappingURL=QueueUtil.js.map