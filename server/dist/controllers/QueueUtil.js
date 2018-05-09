"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueueUtil = function () {
    function QueueUtil() {
        _classCallCheck(this, QueueUtil);
    }

    _createClass(QueueUtil, [{
        key: "getSecondsSinceTimestamp",
        value: function getSecondsSinceTimestamp(timestamp) {
            var currentTimeSeconds = new Date().getTime() / 1000;
            var timstampSeconds = timestamp / 1000;
            return currentTimeSeconds - timestampSeconds;
        }
    }, {
        key: "getStartTimeForTimeInQueue",
        value: function getStartTimeForTimeInQueue(queue, durationInSeconds) {
            var timeUntilPlay = 0;
            queue.map(function (queueItem, index) {
                if (index == 0) {
                    timeUntilPlay += getSecondsSinceTimestamp(queueItem.inserDate);
                    return;
                }
                timeUntilPlay += queueItem.lengthSeconds;
            });
            return timeUntilPlay;
        }
    }]);

    return QueueUtil;
}();

module.exports = new QueueUtil();