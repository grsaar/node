const {getRandomString, getRandomInteger} = require('../utils');

async function addProducts (db){
    const aStatuses =  await db.collection("Status").find({}, {_id:0}).toArray().catch(console.log);
    const aCountries =  await db.collection("Country").find({}, {_id:0}).toArray().catch(console.log);
    const aTypes =  await db.collection("Type").find({}, {_id:0}).toArray().catch(console.log);
    const aClassificationItems =  await db.collection("ClassificationItem").find({}, {_id:0}).toArray().catch(console.log);
    const aClassifications = await db.collection("Classification").find({}, {_id:0}).toArray().catch(console.log);
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
    const oClassification = aClassifications.find(oClassification => oClassification.internalId === oClassificationItem.classificationId);
    oClassificationItem.classification = oClassification;
    const sThumbnailName = getRandomString(getRandomInteger(1,51));
    const sThumbnailData = getRandomString(getRandomInteger(999,1001));
    const sEncodedData = Buffer.from(sThumbnailData, 'base64');
    const oThumbnail = {
        name: sThumbnailName,
        data: sEncodedData
    };
    const oCountry = aCountries[Math.floor(Math.random() * aCountries.length)];
    const oRetailer = {
        name: getRandomString(getRandomInteger(1,51)), 
        taxId: getRandomString(2).toUpperCase() + getRandomInteger(1000000000,10000000000).toString(),
        email: getRandomString(getRandomInteger(1,11)) + '@' + getRandomString(getRandomInteger(1,10)) + '.com',
        counrty: oCountry
    }

    const oProduct = {
        name: getRandomString(getRandomInteger(1,51)),
        description: getRandomString(getRandomInteger(1,51)),
        statusId: oStatus,
        dateAdded: sDateAdded,        
        retailer: oRetailer,
        type: oType,
        classificationItems: [oClassificationItem],
        thumbnail: oThumbnail
    };
    return oProduct;
}


async function insertProduct (db, oProductData){        
    console.log(oProductData); 
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