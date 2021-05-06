const { getRandomString, getRandomInteger } = require('../utils');
const ObjectId = require('mongodb').ObjectID;

async function addRetailers(oModels) {
    const aCountries = await oModels.Country.find({}, { _id: 1 }).catch(console.log);
    const oRetailerResult = await insertRetailer(aCountries, oModels);
    console.log(`Inserted 1 retailer: ${oRetailerResult}`);
}

async function insertRetailer(aCountries, oModels) {
    const sName = getRandomString(getRandomInteger(1, 51));
    const sTaxId = getRandomString(2).toUpperCase() + getRandomInteger(1000000000, 10000000000).toString();
    const sEmail = getRandomString(getRandomInteger(1, 11)) + '@' + getRandomString(getRandomInteger(1, 10)) + '.com';
    const iCountryId = aCountries[Math.floor(Math.random() * aCountries.length)]._id;
    const oRetailerData = {
        name: sName,
        taxId: sTaxId,
        email: sEmail,
        _countryId: iCountryId
    };
    console.log(oRetailerData);
    return new Promise ((resolve, reject) => {
         oModels.Retailer.create(oRetailerData, (err, res) => {
             if(err){
                 reject(err)
             } else {
                 resolve(res);
             }
         });
    });
}

async function insertThumbnail(oModels) {
    const sName = getRandomString(getRandomInteger(1, 51));
    const sData = getRandomString(getRandomInteger(999, 1001));
    const oThumbnailData = {
        name: sName,
        data: sData
    };
    return new Promise((resolve, reject) => {
        oModels.Thumbnail.create(oThumbnailData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

async function addProducts(oModels) {
    const aStatuses = await oModels.Status.find({}, { _id: 1 }).catch(console.log);
    const aRetailers = await oModels.Retailer.find({}, { _id: 1 }).catch(console.log);
    const aTypes = await oModels.Type.find({}, { _id: 1 }).catch(console.log);

    const oProduct = await insertProduct(oModels, aStatuses, aRetailers, aTypes);
    console.log(`Inserted 1 thumbnail: ${oProduct}`);

    const oProductClassificationItem = await insertProductClassificationItem(oModels, oProduct);
    console.log(`Inserted 1 thumbnail: ${oProductClassificationItem}`);

    const oThumbnail = await insertThumbnail(oModels);
    console.log(`Inserted 1 thumbnail: ${oThumbnail}`);

    const oUpdateData = {
        _thumbnailId: oThumbnail._id
    };
    const oConditionData = {
        _id: oProduct._id
    };
    await update(oModels, "Product", oConditionData, oUpdateData);
}

async function insertProduct(oModels, aStatuses, aRetailers, aTypes) {
    const sName = getRandomString(getRandomInteger(1, 51));
    const sDesctiption = getRandomString(getRandomInteger(1, 51));
    const iStatusId = aStatuses[Math.floor(Math.random() * aStatuses.length)]._id;
    const sDateAdded = new Date();
    const iRetailerId = aRetailers[Math.floor(Math.random() * aRetailers.length)]._id;
    const iTypeId = aTypes[Math.floor(Math.random() * aTypes.length)]._id;
    const oProduct = {
        name: sName,
        description: sDesctiption,
        _statusId: iStatusId,
        dateAdded: sDateAdded,
        _retailerId: iRetailerId,
        _typeId: iTypeId
    };
    return new Promise((resolve, reject) => {
        oModels.Product.create(oProduct, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

async function insertProductClassificationItem(oModels, oProduct) {
    const aClassificationItems = await oModels.ClassificationItem.find({}, { _id: 1 }).catch(console.log);
    const iClassificationItemId = aClassificationItems[Math.floor(Math.random() * aClassificationItems.length)]._id;
    const oProductClasItemData = {
        _productId: oProduct._id,
        _classificationItemId: iClassificationItemId
    };

    return new Promise((resolve, reject) => {
        oModels.ProductClassificationItem.create(oProductClasItemData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
    //await oModels.ProductClassificationItem.create(oProductClasItemData).catch(console.log);
}

async function update(oModels, sTableToUpdate, oConditionData, oUpdateData) {
    const oUpdateResult = await oModels[sTableToUpdate].updateMany(oConditionData, { $set: oUpdateData }).catch(console.log);
    console.log(`Updated ${oUpdateResult.nModified} document(s) in ${sTableToUpdate} collection`);
}

async function getCountryProducts(oModels) {
    const aCountries = await oModels.Country.aggregate([{ $sample: { size: 1 } }]).catch(console.log);
    const oCountryId = new ObjectId(aCountries[0]._id); //necessary?
    const aResult = await oModels.Country.aggregate([
        {
            $match: { "_id": oCountryId }
        }, {
            $lookup: {
                from: "Retailer",
                localField: "_id",
                foreignField: "_countryId",
                as: "retailers"
            }
        }, {
            $unwind: "$retailers"
        }, {
            $lookup: {
                from: "Product",
                localField: "retailers._id",
                foreignField: "_retailerId",
                as: "products"
            }
        }, {
            $project: {
                _id: 1,
                name: 1,
                products: "$products"
            }
        }
    ]).catch(console.log);

    const iProductCount = aResult[0] ? aResult[0].products.length : 0;
    console.log(`Get country products result: ${iProductCount} products`);
}

async function getProductsWithHierarchyCode(oModels) {
    const aClassificationItems = await oModels.ClassificationItem.aggregate([{ $sample: { size: 1 } }]).catch(console.log);
    const sHierarchyCode = '/' + aClassificationItems[0].hierarchyCode + '/i';
    //Code has to be without string quotes
    const oHierarchyCode = sHierarchyCode.substring(1, sHierarchyCode.length - 1);
    const aResult = await oModels.ClassificationItem.aggregate([
        {
            $match: {"hierarchyCode": oHierarchyCode }
        }, {
            $lookup: {
                from: "ProductClassificationItem",
                localField: "_id",
                foreignField: "_classificationItemId",
                as: "productClassificationItems"
            }
        }, {
            $unwind: "$productClassificationItems"
        }, {
            $lookup: {
                from: "Product",
                localField: "productClassificationItems._productId",
                foreignField: "_id",
                as: "productClassificationItems.products"
            }
        }, {
            $project: {
                _id: 1,
                name: 1,
                hierarchyCode: 1,
                products: "$productClassificationItems.products"
            }
        }
    ]).catch(console.log);

    let iProductCount = 0;
    if(aResult.length){
        aResult.forEach(oClassificationItem => {
            iProductCount += oClassificationItem.products.length;
        });
    }
    console.log(`Get country products result: ${iProductCount} products`);
}

async function getUnclassifiedProducts(oModels) {
    const aResult = await oModels.Product.aggregate([{
        $lookup: {
            from: "ProductClassificationItem",
            localField: "_id",
            foreignField: "_productId",
            as: "productClassificationItems"
        }
    }, {
        $match: {
            "productClassificationItems._productId": { $exists: false }
        }
    }, {
        $project: {
            _id: 1,
            name: 1
        }
    }
    ]).catch(console.log);

    console.log(`Get unclassified products result: ${aResult.length} products`); 
}

async function getProductsWithThumbnails(oModels) {
    const aProductsMissingThumbnailsResult = await oModels.Product.find({ "_thumbnailId": { $exists: true } }).catch(console.log);
    console.log(`Get products with thumbnails result: ${aProductsMissingThumbnailsResult.length} products`);
}

async function updateProductsStatuses (oModels){
    const aTypeId = await oModels.Type.aggregate([{ $sample: { size: 1 } },  {$project:{_id: 1}}]).catch(console.log);
    const aStatusIds = await oModels.Status.find({},{_id:1}).catch(console.log);
    const iUpdateStatusId = aStatusIds[Math.floor(Math.random() * aStatusIds.length)]._id;
    const iConditionStatusId = aStatusIds.find(oStatus => oStatus._id !== iUpdateStatusId);
    const oConditionData = {
        "_typeId": aTypeId[0]._id,
        "_statusId": iConditionStatusId._id
    };
    const oUpdateData = {
        "_statusId": iUpdateStatusId
    };
    update(oModels, "Product", oConditionData, oUpdateData);
}

async function updateProductName (oModels){
    const aProductId = await oModels.Product.find({}, {_id:1}).catch(console.log);
    const oConditionData ={
        "_id": aProductId[0]._id
    };
    const oUpdateData = {
        "name": getRandomString(getRandomInteger(1, 51)) 
    };
    update(oModels, "Product", oConditionData, oUpdateData);
}

async function deleteRandomProduct (oModels){
    const aProducts = await oModels.Product.aggregate([{ $sample: { size: 1 } }]).catch(console.log);
    const oProductId = new ObjectId(aProducts[0]._id);
    const oDeleteResult = await oModels.Product.deleteOne({ _id: { $eq: oProductId }});
    console.log(`Deleted ${oDeleteResult.deletedCount} product`);
    
}

module.exports = {
    addRetailers,
    addProducts,
    getCountryProducts,
    getProductsWithHierarchyCode,
    getUnclassifiedProducts,
    getProductsWithThumbnails,
    updateProductsStatuses,
    updateProductName,
    deleteRandomProduct
}