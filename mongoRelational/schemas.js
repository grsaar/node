const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');

const Schema = mongoose.Schema;

const ClassificationSchema = new Schema({
    internalId: {type: Int32, required: true},
    name: {type: String, maxLength: 50, required: true}
});

const ClassificationItemSchema = new Schema({
    internalId: {type: Int32, required: true},
    name: {type: String, maxLength: 50, required: true},
    hierarchyCode: {type: String, maxLength: 50},
    _classificationId: Schema.Types.ObjectId,
    parentId: Int32
});

const CountrySchema = new Schema({
    internalId: {type: Int32, required: true},
    name: {type: String, maxLength: 50, required: true}
});

const ProductSchema = new Schema({
    name: {type: String, maxLength: 50, required: true},
    description: {type: String, maxLength: 50},
    _statusId:  {type:  Schema.Types.ObjectId, required: true},
    dateAdded: {type: Date, required: true},
    _thumbnailId: Schema.Types.ObjectId,
    _retailerId: {type: Schema.Types.ObjectId, required: true},
    _typeId: {type: Schema.Types.ObjectId, required: true}
});

const ProductClasItemsSchema = new Schema({
    name: {type: String, maxLength: 50, required: true},
    taxId: {type: String, maxLength: 50},
    email: {type: String, maxLength: 50},
    _countryId: {type: Schema.Types.ObjectId, required: true}
});

const RetailerSchema = new Schema({
    _productId: {type: Schema.Types.ObjectId, required: true},
    _classificationItemId: {type: Schema.Types.ObjectId, required: true}
});

const StatusSchema = new Schema({
    internalId: {type: Int32, required: true},
    name: {type: String, maxLength: 50, required: true}
});

const ThumbnailSchema = new Schema({
    name: {type: String, maxLength: 50, required: true},
    data: {type: Buffer, required: true}
});

const TypeSchema = new Schema({
    internalId: {type: Int32, required: true},
    name: {type: String, maxLength: 50, required: true}
});

module.exports = function defineModels (db){
    const Classification = db.model('Classification', ClassificationSchema);
    const ClassificationItem = db.model('ClassificationItem', ClassificationItemSchema);
    const Country = db.model('Country', CountrySchema);
    const Product = db.model('Product', ProductSchema);
    const ProductClassificationItem = db.model('ProductClassificationItem', ProductClasItemsSchema);
    const Retailer = db.model('Retailer', RetailerSchema);
    const Status = db.model('Status', StatusSchema);
    const Thumbnail = db.model('Thumbnail', ThumbnailSchema);
    const Type = db.model('Type', TypeSchema);
}

 