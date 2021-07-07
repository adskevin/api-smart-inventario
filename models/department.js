var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const DepartmentSchema = new Schema({
    description: { type: String, required: true },
}, {
    versionKey: false
});

const Department = mongoose.model("Department", DepartmentSchema);

Department.createIndexes();

module.exports = Department;