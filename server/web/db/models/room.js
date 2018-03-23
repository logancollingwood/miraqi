var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
        name: String,
        admin: Boolean,
        lastLogin: Date,
    }, 
    {   
        timestamps: true
    }
);

var RoomSchema   = new Schema({
    name: String,
    description: String,
    users: [UserSchema],
});

module.exports = {
    Room: mongoose.model('Room', RoomSchema),
    User: mongoose.model('User', UserSchema)
}