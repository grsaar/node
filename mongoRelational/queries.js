const { getRandomString, getRandomInteger } = require('../utils');
const ObjectId = require('mongodb').ObjectID;

async function addRetailers(db, oModels) {
    const aCountries = await oModels.Country.find({}, { _id: 1 }).catch(console.log);
    console.log(aCountries);
    //while
    /* async function delay(iMillis) {
    return new Promise(resolve => setTimeout(resolve, iMillis));
}*/
    for (let i = 0; i < 5; i++) {
        await insertRetailer(db, aCountries, oModels);
    }
}

async function insertRetailer(db, aCountries, oModels) {
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
    await oModels.Retailer.create(oRetailerData).catch(console.log);
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

async function addProducts(db, oModels) {
    const aStatuses = await oModels.Status.find({}, { _id: 1 }).catch(console.log);
    const aRetailers = await oModels.Retailer.find({}, { _id: 1 }).catch(console.log);
    const aTypes = await oModels.Type.find({}, { _id: 1 }).catch(console.log);

    const oProduct = await insertProduct(oModels, aStatuses, aRetailers, aTypes);
    console.log(oProduct);
    await insertProductClassificationItem(oModels, oProduct);
    const oThumbnail = await insertThumbnail(oModels);
    console.log(oThumbnail);
    const oUpdateData = {
        _thumbnailId: oThumbnail._id,
        description: 'Yuhuuu'
    };
    const oConditionData = {
        _id: oProduct._id
    };
    await update(oModels, "Product", oUpdateData, oConditionData);
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
    await oModels.ProductClassificationItem.create(oProductClasItemData).catch(console.log);

}

async function update(oModels, sTableToUpdate, oUpdateData, oConditionData) {
    console.log(oConditionData);
    console.log(oUpdateData);
    oModels[sTableToUpdate].updateOne(oConditionData, { $set: oUpdateData }).catch(console.log);
}

async function getCountryProducts(oModels) {
    //ObjectId("60841ec7b81fb8691cb68fce")
    const aCountries = await oModels.Country.aggregate([{ $sample: { size: 1 } }]).catch(console.log);
    const oCountryId = new ObjectId(aCountries[0]._id); //necessary?
    console.log(typeof oCountryId);
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
                products: "$products.name"
            }
        }
    ]).catch(console.log);
    console.log(aResult);
}

async function getProductsWithHierarchyCode(oModels) {
    const aClassificationItems = await oModels.ClassificationItem.aggregate([{ $sample: { size: 1 } }]).catch(console.log);
    const sHierarchyCode = '/' + aClassificationItems[0].hierarchyCode + '/i';
    console.log(sHierarchyCode);
    const aResult = await oModels.ClassificationItem.aggregate([
        {
            $match: { "hierarchyCode": sHierarchyCode }
        }, {
            $lookup: {
                from: "ProductClassificationItem",
                localField: "_id",
                foreignField: "_classificationItemId",
                as: "productClassificationItems"
            }
        }, {
            $match: {
                "productClassificationItems": { $ne: [] } //vist pole vaja, " default behavior for $unwind is to omit documents where the referenced field is missing or an empty array"
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
                products: "$productClassificationItems.products.name"
            }
        }
    ]).catch(console.log);
    console.log(aResult);
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
        $unwind: {
            path: "$productClassificationItems",
            preserveNullAndEmptyArrays: true
        }
    }, {
        $match: {
            "productClassificationItems._productId": { $exists: false } //no
        }
    }, {
        $project: {
            _id: 1,
            name: 1
        }
    }
    ]).catch(console.log);
    console.log(aResult);
}

async function getProductsWithNoThumbnails(oModels) {
    const aProductsMissingThumbnailsResult = await oModels.Product.find({ "_thumbnailId": { $exists: false } }).catch(console.log);
    if (aProductsMissingThumbnailsResult.length) {
        aProductsMissingThumbnailsResult.forEach(async function (oProduct) {
            const oThumbnail = await insertThumbnail(oModels);
            console.log(oThumbnail);
            console.log(oProduct);
            const oUpdateData = {
                _thumbnailId: oThumbnail._id,
            };
            const oConditionData = {
                _id: oProduct._id
            };
            await update(oModels, "Product", oUpdateData, oConditionData);
        });
    }
    console.log(aProductsMissingThumbnailsResult);

}

async function deleteRetailersWithNoProducts(oModels) {
    const aRetailersWithNoProducts = await oModels.Retailer.aggregate([{
        $lookup: {
            from: "Product",
            localField: "_id",
            foreignField: "_retailerId",
            as: "products"
        }
    },{
        $unwind: {
            path: "$products",
            preserveNullAndEmptyArrays: true
        }
    },{
        $match: {
            "products._retailerId": {$exists: false} //no
        }
    },{
        $project:{
            _id: 1,
            name: 1
        }
    }
    ]).catch(console.log);
    console.log(aRetailersWithNoProducts);

    if(aRetailersWithNoProducts.length){
        const aRetailerIds = aRetailersWithNoProducts.map(oRetailer => new ObjectId(oRetailer.Id));
        console.log(aRetailerIds);
        await oModels.Retailer.deleteMany({ _id: { $in: aRetailerIds }});
    }

}

async function deleteRandomProduct (oModels){
    const aProducts = await oModels.Product.aggregate([{ $sample: { size: 1 } }]).catch(console.log);
    const oProductId = new ObjectId(aProducts[0]._id);
    await oModels.Product.deleteOne({ _id: { $eq: oProductId }});
    /7const deletedPrCheck = await oModels.Product.find({_id: oProductId});
    //console.log(deletedPrCheck);
}

module.exports = {
    addRetailers,
    addProducts,
    getCountryProducts,
    getProductsWithHierarchyCode,
    getUnclassifiedProducts,
    getProductsWithNoThumbnails,
    deleteRetailersWithNoProducts,
    deleteRandomProduct
}