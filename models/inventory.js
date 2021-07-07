var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const InventorySchema = new Schema({
    date: { type: Date, default: Date.now },
    department: { type: Schema.ObjectId, ref: 'Department' },
    placeDescription: { type: String, required: true },
    inventoryNumber: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, required: true },
    category: { type: Schema.ObjectId, ref: 'Category' },
    conservationState: { type: String, required: true },
    tagAbscence: { type: String, required: true },
    itemStatus: { type: String, required: true },
    note: { type: String, required: true }
}, {
    versionKey: false
});

const Inventory = mongoose.model("Inventory", InventorySchema);

Inventory.createIndexes();

module.exports = Inventory;