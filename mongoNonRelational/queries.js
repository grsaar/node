const {getRandomString, getRandomInteger} = require('../utils');
const ObjectId = require('mongodb').ObjectID;

async function addProducts (db, oModels){
    const aStatuses =  await oModels.Status.find({}, {_id:0}).catch(console.log);
    const aCountries =  await oModels.Country.find({}, {_id:0}).catch(console.log);
    const aTypes =  await oModels.Type.find({}, {_id:0}).catch(console.log);
    const aClassificationItems =  await oModels.ClassificationItem.find({}).catch(console.log);
    const aClassifications = await oModels.Classification.find({}).catch(console.log);
    console.log(aClassifications)
    const oProductData = prepareProductData(aStatuses, aCountries, aTypes, aClassificationItems, aClassifications);
    
   const oProduct = await insertProduct(db, oProductData);
    console.log(oProduct);
    //Do something
}

function prepareProductData(aStatuses, aCountries, aTypes, aClassificationItems, aClassifications){
    const oStatus =   aStatuses[Math.floor(Math.random() * aStatuses.length)];
    const sDateAdded =  new Date(); 
    const oType = aTypes[Math.floor(Math.random() * aTypes.length)];
    const oClassificationItem = aClassificationItems[Math.floor(Math.random() * aClassificationItems.length)];
    const oClassification = aClassifications.find(oItem => oClassificationItem._classificationId.equals(oItem._id));
    //To ignore schema
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
        classificationItems: [oModifiedClassificationItem],
        thumbnail: oThumbnail
    };
    return oProduct;
}


async function insertProduct (db, oProductData){  
  return new Promise ((resolve, reject) => {
    db.collection("Product").insertOne(oProductData, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve(res.ops[0]);
            }
        });
    });
}

async function getCountryProducts (db, oModels){
    const aCountries = await oModels.Country.aggregate([{ $sample: { size: 1 } }]).catch(console.log);
    const iCountryId = aCountries[0].internalId;
    const aResult = await oModels.Product.find({"retailer.country.internalId": iCountryId}).catch(console.log);
    console.log(aResult);
}

async function getProductsWithHierarchyCode(oModels) {
    const aClassificationItems = await oModels.ClassificationItem.aggregate([{ $sample: { size: 1 } }]).catch(console.log);
    const sHierarchyCode = '/' + aClassificationItems[0].hierarchyCode + '/i';
    console.log(sHierarchyCode);
    const aResult = await oModels.Product.find({"classificationItems.hierarchyCode": sHierarchyCode}).catch(console.log);
    console.log(aResult);
}

async function getUnclassifiedProducts(oModels) {
    const aResult = await oModels.Product.find({"classificationItems": null }).catch(console.log);
    console.log(aResult);
}

async function getProductsWithThumbnails(oModels) {
    const aResult = await oModels.Product.find({ "thumbnail": {$ne:null} }).catch(console.log);  
    console.log(aResult);

}

async function updateProductsStatuses (oModels){
    const aTypeId = await oModels.Type.aggregate([{ $sample: { size: 1 } },  {$project:{internalId: 1}}]).catch(console.log);
    const aStatuses = await oModels.Status.find({}).catch(console.log);
    const oUpdateStatus = aStatuses[Math.floor(Math.random() * aStatuses.length)];
    const oConditionStatus = aStatuses.find(oStatus => oStatus.internalId !== oUpdateStatus.internalId);
    console.log(oUpdateStatus);
    console.log(oConditionStatus.internalId);
    console.log(aTypeId[0].internalId)
    const oResult = await oModels.Product.updateMany(
        {"type.internalId": aTypeId[0].internalId,"status.internalId": oConditionStatus.internalId},
        {$set: 
            {"status": oUpdateStatus}
        }).catch(console.log);
    console.log(oResult);
}

async function updateProductName (oModels){
    const aProductId = await oModels.Product.find({}, {_id:1}).catch(console.log);
    const sName = getRandomString(getRandomInteger(1,51));
    const oResult = await oModels.Product.updateOne(
        {"_id": aProductId[0]._id},
        {$set: 
            {"name": sName}
        });
    console.log(oResult);
}

async function deleteRandomProduct (oModels){
    const aProducts = await oModels.Product.aggregate([{ $sample: { size: 1 } }]).catch(console.log);
    const oProductId = new ObjectId(aProducts[0]._id);
    await oModels.Product.deleteOne({ _id: { $eq: oProductId }});
    const deletedPrCheck = await oModels.Product.find({_id: oProductId});
    console.log(deletedPrCheck);
}

module.exports = {
    addProducts,
    getCountryProducts,
    getProductsWithHierarchyCode,
    getUnclassifiedProducts,
    getProductsWithThumbnails,
    updateProductsStatuses,
    updateProductName,
    deleteRandomProduct
}