const {getRandomString, getRandomInteger} = require('../utils');
const ObjectId = require('mongodb').ObjectID;

async function addProduct (db, oModels){
    const aStatuses =  await oModels.Status.find({}, {_id:0}).catch(console.log);
    const aCountries =  await oModels.Country.find({}, {_id:0}).catch(console.log);
    const aTypes =  await oModels.Type.find({}, {_id:0}).catch(console.log);
    const aClassificationItems =  await oModels.ClassificationItem.find({}).catch(console.log);
    const aClassifications = await oModels.Classification.find({}).catch(console.log);
    const oProductData = prepareProductData(aStatuses, aCountries, aTypes, aClassificationItems, aClassifications);
    
   const aProductResult = await insertProduct(db, oProductData);   
    const sString = `Inserted ${aProductResult[0].insertedCount} product, `.concat(`elapse time ${aProductResult[2] - aProductResult[1]} ms`);
    console.log(sString);
    return {
        ExecutedQuery: 'Insert product',
        ResultCount: aProductResult[0].insertedCount,
        ElapseTime: aProductResult[2] - aProductResult[1],
        TimeStamp: new Date(aProductResult[1])
    };
}

function prepareProductData(aStatuses, aCountries, aTypes, aClassificationItems, aClassifications){
    const oStatus =   aStatuses[Math.floor(Math.random() * aStatuses.length)];
    const sDateAdded =  new Date(); 
    const oType = aTypes[Math.floor(Math.random() * aTypes.length)];
    const oClassificationItem = aClassificationItems[Math.floor(Math.random() * aClassificationItems.length)];
    const oClassification = aClassifications.find(oItem => oClassificationItem._classificationId.equals(oItem._id));
    
    oModifiedClassificationItem = {
        internalId: oClassificationItem.internalId,
        name: oClassificationItem.name,
        hierarchyCode: oClassificationItem.hierarchyCode,
        parentId: oClassificationItem.parentId,
        classification: {
            internalId: oClassification.internalId,
            name: oClassification.name
        }
    };
    const sThumbnailName = getRandomString(getRandomInteger(1,51));
    const sThumbnailData = getRandomString(getRandomInteger(999,1001));
    const oThumbnail = {
        name: sThumbnailName,
        data: sThumbnailData
    };
    const oCountry = aCountries[Math.floor(Math.random() * aCountries.length)];
    const oRetailer = {
        name: getRandomString(getRandomInteger(1,51)), 
        taxId: getRandomString(2).toUpperCase() + getRandomInteger(1000000000,10000000000).toString(),
        email: getRandomString(getRandomInteger(1,11)) + '@' + getRandomString(getRandomInteger(1,10)) + '.com',
        country: oCountry
    }

    const oProduct = {
        name: getRandomString(getRandomInteger(1,51)),
        description: getRandomString(getRandomInteger(1,51)),
        status: oStatus,
        dateAdded: sDateAdded,        
        retailer: oRetailer,
        type: oType,
        classificationItems: getRandomInteger(0,2) ? [oModifiedClassificationItem] : [],
        thumbnail: getRandomInteger(0,2) ? oThumbnail : null
    };
    return oProduct;
}


async function insertProduct (db, oProductData){
    const sQueryStartTimestamp = Date.now();

  return new Promise ((resolve, reject) => {
    db.collection("Product").insertOne(oProductData, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
            }
        });
    });
}

async function getCountryProducts (db, oModels){
    const aCountry = await oModels.Country.aggregate([{ $sample: { size: 1 } }, { $project: { internalId: 1 } }]).catch(console.log);
    const iCountryId = aCountry[0].internalId;
    const sQueryStartTimestamp = Date.now();

    const iResultCount = await db.collection("Product").find({"retailer.country.internalId": iCountryId}).count().catch(console.log);
   
    const sQueryEndTimestamp = Date.now();
    console.log(`Get country products result: ${iResultCount} documents`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get country products',
        ResultCount: iResultCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp)
    };
}

async function getProductsWithHierarchyCode(db, oModels) {
    const aClassificationItems = await oModels.ClassificationItem.aggregate([{ $sample: { size: 1 } }, { $project: {hierarchyCode: 1 } }]).catch(console.log);
    const sHierarchyCode = '/' + aClassificationItems[0].hierarchyCode + '/i';
    const sQueryStartTimestamp = Date.now();

    const iResultCount = await db.collection("Product").find({"classificationItems.hierarchyCode": sHierarchyCode}).count().catch(console.log);
    
    const sQueryEndTimestamp = Date.now();
    console.log(`Get products with HierarcyCode result: ${iResultCount} documents`); 
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get products with hierarchyCode',
        ResultCount: iResultCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp)
    };
}

async function getUnclassifiedProducts(db) {
    const sQueryStartTimestamp = Date.now();
    const iResultCount = await db.collection("Product").find({"classificationItems": null }).count().catch(console.log);

    const sQueryEndTimestamp = Date.now();
    console.log(`Get unclassified products result: ${iResultCount} documents`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get unclassified products',
        ResultCount: iResultCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp)
    };
}

async function getProductsWithThumbnails(db) {
    const sQueryStartTimestamp = Date.now();
    const iResultCount = await db.collection("Product").find({ "thumbnail": {$ne:null} }).count().catch(console.log);

    const sQueryEndTimestamp = Date.now();
    console.log(`Get products with thumbnails result: ${iResultCount} documents`); 
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get products with thumbnails',
        ResultCount: iResultCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp)
    };

}

async function getProductCount(db) {
    const iCountResult = await db.collection("Product").countDocuments({}).catch(console.log);
    return {
        ExecutedQuery: 'Get product count',
        ResultCount: iCountResult,
        ElapseTime: '',
        TimeStamp: new Date(Date.now()) 
    }
}

async function updateProductsStatuses (db, oModels){
    const aTypeId = await oModels.Type.aggregate([{ $sample: { size: 1 } },  {$project:{internalId: 1}}]).catch(console.log);
    const aStatuses = await oModels.Status.find({}).catch(console.log);
    const oUpdateStatus = aStatuses[Math.floor(Math.random() * aStatuses.length)];
    const oConditionStatus = aStatuses.find(oStatus => oStatus.internalId !== oUpdateStatus.internalId);
    const sQueryStartTimestamp = Date.now();

    const oResult = await db.collection("Product").updateMany(
        {
            "type.internalId": aTypeId[0].internalId,
            "status.internalId": oConditionStatus.internalId
        },{
            $set:{
                "status": oUpdateStatus
            }
        }).catch(console.log);

    const sQueryEndTimestamp = Date.now();    
    console.log(`Updated status for ${oResult.modifiedCount} products`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Update product statuses',
        ResultCount: oResult.modifiedCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };
}

async function updateProductName (db){
    const aProductId = await db.collection("Product").find({}, {_id:1}).toArray();
    const sName = getRandomString(getRandomInteger(1,51));
    const sQueryStartTimestamp = Date.now();

    const oResult = await db.collection("Product").updateOne(
        {
            "_id": aProductId[0]._id
        },{
            $set: {
                "name": sName
            }
        });

    const sQueryEndTimestamp = Date.now();  
    console.log(`Updated name for ${oResult.modifiedCount} product`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Update product name',
        ResultCount: oResult.modifiedCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };
}

async function deleteRandomProduct (db){
    const aProduct = await db.collection("Product").aggregate([{ $sample: { size: 1 } }, { $project: { _id: 1 } }]).toArray();
    const oProductId = new ObjectId(aProduct[0]._id);
    const sQueryStartTimestamp = Date.now();

    const oDeleteResult = await db.collection("Product").deleteOne({ _id: { $eq: oProductId }});

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
    addProduct,
    getCountryProducts,
    getProductsWithHierarchyCode,
    getUnclassifiedProducts,
    getProductsWithThumbnails,
    getProductCount,
    updateProductsStatuses,
    updateProductName,
    deleteRandomProduct
}