var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const SpectatorSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
}, {
    versionKey: false
});

const Spactator = mongoose.model("Spectator", SpectatorSchema);

Spactator.createIndexes();

module.exports = Spactator;
