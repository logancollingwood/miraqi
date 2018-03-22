var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RoomSchema   = new Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Room', RoomSchema);