var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, index: true },
    role: { type: String, required: true },
}, {
    versionKey: false
});

const User = mongoose.model("User", UserSchema);

User.createIndexes();

module.exports = User;
