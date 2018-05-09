'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueueHandler = function () {
    function QueueHandler(socket) {
        _classCallCheck(this, QueueHandler);

        this.socket = socket;
        this.queue = [];
    }

    _createClass(QueueHandler, [{
        key: 'processQueue',
        value: function processQueue() {
            if (this.queue.length == 0) {
                return;
            }

            queueItem = queue[0];
            this.broadcastPlayMessage(queueItem);
        }
    }, {
        key: 'queueYoutube',
        value: function queueYoutube(youtubeVideoId) {
            var queueItem = {
                type: 'yt',
                playId: youtubeVideoId
            };
            this.queue.push(queueItem);
            if (this.queue.length == 1) {
                this.processQueue();
            }
        }
    }, {
        key: 'broadcastPlayMessage',
        value: function broadcastPlayMessage(queueItem) {
            //         this._io.to(this.room._id).emit('play', queueItem.playUrl);

        }
    }]);

    return QueueHandler;
}();

module.exports = QueueHandler;