var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    name: { type: String, required: true },
    login: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, index: true },
    role: { type: String, required: true },
    activeSocketId: { type: String },
    activeRoom: { type: Schema.ObjectId, ref: 'Room' }
}, {
    versionKey: false
});

const User = mongoose.model("User", UserSchema);

User.createIndexes();

module.exports = User;
