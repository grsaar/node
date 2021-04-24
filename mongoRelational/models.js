const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');

const Schema = mongoose.Schema;

const ClassificationSchema = new Schema({
    internalId: { type: Int32, required: true },
    name: { type: String, maxLength: 50, required: true }
}, {
    versionKey: false,
    collection: 'Classification'
});

const ClassificationItemSchema = new Schema({
    internalId: { type: Int32, required: true },
    name: { type: String, maxLength: 100, required: true },
    hierarchyCode: { type: String, maxLength: 50 },
    _classificationId: { type: Schema.Types.ObjectId, required: true },
    parentId: Int32,
   // classification: Schema.Types.Mixed
}, {
    versionKey: false,
    collection: 'ClassificationItem'
});

const CountrySchema = new Schema({
    internalId: { type: Int32, required: true },
    name: { type: String, maxLength: 50, required: true }
}, {
    versionKey: false,
    collection: 'Country'
});

const ProductSchema = new Schema({
    name: { type: String, maxLength: 50, required: true },
    description: { type: String, maxLength: 50 },
    _statusId: { type: Schema.Types.ObjectId, required: true },
    dateAdded: { type: Date, required: true },
    _thumbnailId: Schema.Types.ObjectId,
    _retailerId: { type: Schema.Types.ObjectId, required: true },
    _typeId: { type: Schema.Types.ObjectId, required: true }
}, {
    versionKey: false,
    collection: 'Product'
});

const RetailerSchema = new Schema({
    name: { type: String, maxLength: 50, required: true },
    taxId: { type: String, maxLength: 50 },
    email: { type: String, maxLength: 50 },
    _countryId: { type: Schema.Types.ObjectId, required: true }
}, {
    versionKey: false,
    collection: 'Retailer'
});

const ProductClasItemsSchema = new Schema({
    _productId: { type: Schema.Types.ObjectId, required: true },
    _classificationItemId: { type: Schema.Types.ObjectId, required: true }
}, {
    versionKey: false,
    collection: 'ProductClassificationItem'
});

const StatusSchema = new Schema({
    internalId: { type: Int32, required: true },
    name: { type: String, maxLength: 50, required: true }
}, {
    versionKey: false,
    collection: 'Status'
});

const ThumbnailSchema = new Schema({
    name: { type: String, maxLength: 50, required: true },
    data: { type: String, required: true }
}, {
    versionKey: false,
    collection: 'Thumbnail'
});

const TypeSchema = new Schema({
    internalId: { type: Int32, required: true },
    name: { type: String, maxLength: 50, required: true }
}, {
    versionKey: false,
    collection: 'Type'
});

module.exports = function defineModels(db) {
    return {
        Classification: db.model('Classification', ClassificationSchema),
        ClassificationItem: db.model('ClassificationItem', ClassificationItemSchema),
        Country: db.model('Country', CountrySchema),
        Product: db.model('Product', ProductSchema),
        ProductClassificationItem: db.model('ProductClassificationItem', ProductClasItemsSchema),
        Retailer: db.model('Retailer', RetailerSchema),
        Status: db.model('Status', StatusSchema),
        Thumbnail: db.model('Thumbnail', ThumbnailSchema),
        Type: db.model('Type', TypeSchema)
    }
}

