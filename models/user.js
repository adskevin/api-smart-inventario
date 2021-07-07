var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, index: true },
    role: { type: String, required: true },
    zipCode: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    district: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
}, {
    versionKey: false
});

const User = mongoose.model("User", UserSchema);

User.createIndexes();

module.exports = User;
