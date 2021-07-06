var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const RoomSchema = new Schema({
    owner: { type: Schema.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    participants: [{ type: Schema.ObjectId, ref: 'User' }],
}, {
    versionKey: false
});

const Room = mongoose.model("Room", RoomSchema);

Room.createIndexes();

module.exports = Room;