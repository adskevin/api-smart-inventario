var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const CategorySchema = new Schema({
    description: { type: String, required: true },
}, {
    versionKey: false
});

const Category = mongoose.model("Category", CategorySchema);

Category.createIndexes();

module.exports = Category;