const { getRandomString, getRandomInteger } = require('../utils');
const ObjectId = require('mongodb').ObjectID;

async function addRetailer(oModels) {
    const aCountries = await oModels.Country.find({}, { _id: 1 }).catch(console.log);
    const aRetailerResult = await insertRetailer(aCountries, oModels);
    console.log(`Inserted 1 retailer with _id: ${aRetailerResult[0]._id}`);
    console.log(`Elapse time ${aRetailerResult[2] - aRetailerResult[1]}`);
    return {
        ExecutedQuery: 'Insert retailer',
        ResultCount: 1,
        ElapseTime: aRetailerResult[2] - aRetailerResult[1],
        TimeStamp: new Date(aRetailerResult[1]) 
    };
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
    const sQueryStartTimestamp = Date.now();

    return new Promise((resolve, reject) => {
        oModels.Retailer.create(oRetailerData, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
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
    const sQueryStartTimestamp = Date.now();

    return new Promise((resolve, reject) => {
        oModels.Thumbnail.create(oThumbnailData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
            }
        });
    });
}

async function addProduct(oModels) {
    const aStatuses = await oModels.Status.find({}, { _id: 1 }).catch(console.log);
    const aRetailers = await oModels.Retailer.find({}, { _id: 1 }).catch(console.log);
    const aTypes = await oModels.Type.find({}, { _id: 1 }).catch(console.log);

    const aProductResult = await insertProduct(oModels, aStatuses, aRetailers, aTypes);
    const oProduct = aProductResult[0];
    console.log(`Inserted 1 product with _id: ${oProduct._id}`);
    console.log(`Elapse time ${aProductResult[2] - aProductResult[1]}`);
    const aResultsToReturn = [
        {
            ExecutedQuery: 'Insert product',
            ResultCount: 1,
            ElapseTime: aProductResult[2] - aProductResult[1],
            TimeStamp: new Date(aProductResult[1])
        }
    ];

    if (getRandomInteger(0, 2)) {
        const aProductClassificationItemResult = await insertProductClassificationItem(oModels, oProduct);
        console.log(`Inserted 1 product classification item with _id: ${aProductClassificationItemResult[0]._id}`);
        console.log(`Elapse time ${aProductClassificationItemResult[2] - aProductClassificationItemResult[1]}`);
        aResultsToReturn.push({
            ExecutedQuery: 'Insert product classification item',
            ResultCount: 1,
            ElapseTime: aProductClassificationItemResult[2] - aProductClassificationItemResult[1],
            TimeStamp: new Date(aProductClassificationItemResult[1])
        });
    }

    if (getRandomInteger(0, 2)) {
        const aThumbnailResult = await insertThumbnail(oModels);
        const oThumbnail = aThumbnailResult[0];
        console.log(`Inserted 1 thumbnail with _id: ${oThumbnail._id}`);
        console.log(`Elapse time ${aThumbnailResult[2] - aThumbnailResult[1]}`);
        aResultsToReturn.push({
            ExecutedQuery: 'Insert thumbnail',
            ResultCount: 1,
            ElapseTime: aThumbnailResult[2] - aThumbnailResult[1],
            TimeStamp: new Date(aThumbnailResult[1])
        });

        const oUpdateData = {
            _thumbnailId: oThumbnail._id
        };
        const oConditionData = {
            _id: oProduct._id
        };
        const aUpdateResult = await update(oModels, "Product", oConditionData, oUpdateData);
        console.log(`Updated ${aUpdateResult[0].nModified} documents(s) in Product collection`);
        console.log(`Elapse time ${aUpdateResult[2] - aUpdateResult[1]}`);
        aResultsToReturn.push({
            ExecutedQuery: 'Update product',
            ResultCount: aUpdateResult[0].nModified,
            ElapseTime: aUpdateResult[2] - aUpdateResult[1],
            TimeStamp: new Date(aUpdateResult[1])
        });
    }
    return aResultsToReturn;
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
    const sQueryStartTimestamp = Date.now();

    return new Promise((resolve, reject) => {
        oModels.Product.create(oProduct, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
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
    const sQueryStartTimestamp = Date.now();

    return new Promise((resolve, reject) => {
        oModels.ProductClassificationItem.create(oProductClasItemData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
            }
        });
    });
}

async function update(oModels, sTableToUpdate, oConditionData, oUpdateData) {
    const sQueryStartTimestamp = Date.now();

    return new Promise((resolve, reject) => {
         oModels[sTableToUpdate].updateMany(oConditionData, { $set: oUpdateData }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
            }
         });
    });
}

async function getCountryProducts(oModels) {
    const aCountries = await oModels.Country.aggregate([{ $sample: { size: 1 } }, { $project: { _id: 1 } }]).catch(console.log);
    const oCountryId = new ObjectId(aCountries[0]._id);
    const sQueryStartTimestamp = Date.now();
    
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

    const sQueryEndTimestamp = Date.now();
    const iProductCount = aResult[0] ? aResult[0].products.length : 0;
    console.log(`Get country products result: ${iProductCount} products`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get counrty products',
        ResultCount: iProductCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };
}

async function getProductsWithHierarchyCode(oModels) {
    const aClassificationItems = await oModels.ClassificationItem.aggregate([{ $sample: { size: 1 } }, { $project: {hierarchyCode: 1 } }]).catch(console.log);
    const sHierarchyCode = '/' + aClassificationItems[0].hierarchyCode + '/i';
    //Code has to be without string quotes
    const oHierarchyCode = sHierarchyCode.substring(1, sHierarchyCode.length - 1);
    const sQueryStartTimestamp = Date.now();

    const aResult = await oModels.ClassificationItem.aggregate([
        {
            $match: { "hierarchyCode": oHierarchyCode }
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

    const sQueryEndTimestamp = Date.now();
    let iProductCount = 0;
    if (aResult.length) {
        aResult.forEach(oClassificationItem => {
            iProductCount += oClassificationItem.products.length;
        });
    }
    console.log(`Get products with hierarchyCode result: ${iProductCount} products`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get products with hierarchyCode',
        ResultCount: iProductCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };
}

async function getUnclassifiedProducts(oModels) {
    const sQueryStartTimestamp = Date.now();

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

    const sQueryEndTimestamp = Date.now();
    console.log(`Get unclassified products result: ${aResult.length} products`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get unclassified products',
        ResultCount: aResult.length,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };
}

async function getProductsWithThumbnails(oModels) {
    const sQueryStartTimestamp = Date.now();
    const aProductsWithThumbnailsResult = await oModels.Product.find({ "_thumbnailId": { $exists: true } }).catch(console.log);
    
    const sQueryEndTimestamp = Date.now(); 
    console.log(`Get products with thumbnails result: ${aProductsWithThumbnailsResult.length} products`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get products with thumbnails',
        ResultCount: aProductsWithThumbnailsResult.length,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };
}

async function getProductCount(oModels) {
    const iCountResult = await oModels.Product.countDocuments({}).catch(console.log);
    return {
        ExecutedQuery: 'Get product count',
        ResultCount: iCountResult,
        ElapseTime: '',
        TimeStamp: new Date(Date.now()) 
    }
}

async function getRetailerCount(oModels) {
    const iCountResult = await oModels.Retailer.countDocuments({}).catch(console.log);
    return {
        ExecutedQuery: 'Get retailer count',
        ResultCount: iCountResult,
        ElapseTime: '',
        TimeStamp: new Date(Date.now()) 
    }
}

async function updateProductsStatuses(oModels) {
    const aTypeId = await oModels.Type.aggregate([{ $sample: { size: 1 } }, { $project: { _id: 1 } }]).catch(console.log);
    const aStatusIds = await oModels.Status.find({}, { _id: 1 }).catch(console.log);
    const iUpdateStatusId = aStatusIds[Math.floor(Math.random() * aStatusIds.length)]._id;
    const iConditionStatusId = aStatusIds.find(oStatus => oStatus._id !== iUpdateStatusId);
    const oConditionData = {
        "_typeId": aTypeId[0]._id,
        "_statusId": iConditionStatusId._id
    };
    const oUpdateData = {
        "_statusId": iUpdateStatusId
    };
    const aUpdateResult = await update(oModels, "Product", oConditionData, oUpdateData);
    console.log(`Updated ${aUpdateResult[0].nModified} documents(s) in Product collection`);
    console.log(`Elapse time ${aUpdateResult[2] - aUpdateResult[1]}`);
    return {
        ExecutedQuery: 'Update product statuses',
        ResultCount: aUpdateResult[0].nModified,
        ElapseTime: aUpdateResult[2] - aUpdateResult[1],
        TimeStamp: new Date(aUpdateResult[1])
    };
}

async function updateProductName(oModels) {
    const aProductId = await oModels.Product.find({}, { _id: 1 }).catch(console.log);
    const oConditionData = {
        "_id": aProductId[0]._id
    };
    const oUpdateData = {
        "name": getRandomString(getRandomInteger(1, 51))
    };
    const aUpdateResult = await update(oModels, "Product", oConditionData, oUpdateData);
    console.log(`Updated ${aUpdateResult[0].nModified} documents(s) in Product collection`);
    console.log(`Elapse time ${aUpdateResult[2] - aUpdateResult[1]}`);
    return {
        ExecutedQuery: 'Update product name',
        ResultCount: aUpdateResult[0].nModified,
        ElapseTime: aUpdateResult[2] - aUpdateResult[1],
        TimeStamp: new Date(aUpdateResult[1])
    };
}

async function deleteRandomProduct(oModels) {
    const aProducts = await oModels.Product.aggregate([{ $sample: { size: 1 } }, { $project: { _id: 1 } }]).catch(console.log);
    const oProductId = new ObjectId(aProducts[0]._id);
    const sQueryStartTimestamp = Date.now();

    const oDeleteResult = await oModels.Product.deleteOne({ _id: { $eq: oProductId } });

    const sQueryEndTimestamp = Date.now();
    console.log(`Deleted ${oDeleteResult.deletedCount} product`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Delete product',
        ResultCount: oDeleteResult.deletedCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };

}

module.exports = {
    addRetailer,
    addProduct,
    getCountryProducts,
    getProductsWithHierarchyCode,
    getUnclassifiedProducts,
    getProductsWithThumbnails,
    getProductCount,
    getRetailerCount,
    updateProductsStatuses,
    updateProductName,
    deleteRandomProduct
}