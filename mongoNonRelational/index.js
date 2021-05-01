const {getRandomString, getRandomInteger} = require('../utils');
const mongoose = require('mongoose')

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

module.exports = {
    addProducts
}