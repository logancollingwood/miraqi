var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: String,
    admin: Boolean,
    lastLogin: Date,
    discordId: String,
    loginProviderId: String,
    loginProviderType: String,
    profile: Object
}, {
    timestamps: true
});
var MessageSchema = new Schema({
    message: String,
    userId: mongoose.Schema.Types.ObjectId,
}, {
    timestamps: true
});
var QueueItemSchema = new Schema({
    playUrl: String,
    trackName: String,
    type: String,
    lengthSeconds: Number,
    userId: mongoose.Schema.Types.ObjectId,
    playTime: Date,
}, {
    timestamps: true
});
var RoomSchema = new Schema({
    name: String,
    description: String,
    sourceIp: String,
    roomProviderId: String,
    roomProviderType: String,
    users: [UserSchema],
    messages: [MessageSchema],
    queue: [QueueItemSchema]
}, {
    timestamps: true
});
var RoomStatSchema = new Schema({
    roomId: mongoose.Schema.Types.ObjectId,
    playUrl: String,
    title: String,
    type: String,
    count: Number
}, {
    timestamps: true
});
module.exports = {
    Room: mongoose.model('Room', RoomSchema),
    User: mongoose.model('User', UserSchema),
    Message: mongoose.model('Message', MessageSchema),
    QueueItem: mongoose.model('QueueItem', QueueItemSchema),
    RoomStat: mongoose.model('RoomStat', RoomStatSchema)
};
//# sourceMappingURL=models.js.map