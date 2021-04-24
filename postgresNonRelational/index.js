const {getRandomString, getRandomInteger} = require('../utils');

async function addProducts (db){
    const oStatusResult =  await db.query(`SELECT * FROM "Status"`).catch(console.log);
    const oCountriesResult =  await db.query(`SELECT * FROM "Country"`).catch(console.log);
    const oTypeResult =  await db.query(`SELECT * FROM "Type"`).catch(console.log);
    const oClassificationItemsResult =  await db.query(`SELECT * FROM "Classification Item"`).catch(console.log);
    const oClassificationResult =  await db.query(`SELECT * FROM "Classification"`).catch(console.log);
    const aProductData = prepareProductData(oStatusResult.rows, oCountriesResult.rows, oTypeResult.rows, oClassificationItemsResult.rows, oClassificationResult.rows);

   const aProduct = await insertProduct(db, aProductData);
      console.log(aProduct[0]);
}

function prepareProductData (aStatuses, aCountries, aTypes, aClassificationItems, aClassifications){
    const oStatus =   aStatuses[Math.floor(Math.random() * aStatuses.length)];
    const sDateAdded =  new Date(); 
    const oType = aTypes[Math.floor(Math.random() * aTypes.length)];
    const oClassificationItem = aClassificationItems[Math.floor(Math.random() * aClassificationItems.length)];
    const oClassification = aClassifications.find(oClassification => oClassification.internalId === oClassificationItem.classificationId);
    oClassificationItem.classification = oClassification;
    const sThumbnailName = getRandomString(getRandomInteger(1,51));
    const sThumbnailData = getRandomString(getRandomInteger(1000,10000));
    const oThumbnail = {
        name: sThumbnailName,
        data: sThumbnailData
    };
    const oCountry = aCountries[Math.floor(Math.random() * aCountries.length)];
    const oRetailer = {
        name: getRandomString(getRandomInteger(1,51)), 
        taxId: getRandomString(2).toUpperCase() + getRandomInteger(1000000000,10000000000).toString(),
        email: getRandomString(getRandomInteger(1,11)) + '@' + getRandomString(getRandomInteger(1,10)) + '.com',
        counrty: oCountry
    }

    const aProduct = [{
        name: getRandomString(getRandomInteger(1,51)),
        description: getRandomString(getRandomInteger(1,51)),
        status: oStatus,
        dateAdded: sDateAdded,        
        retailer: oRetailer,
        type: oType,
        classificationItems: [oClassificationItem],
        thumbnail: oThumbnail
    }];
    return aProduct;
}

async function insertProduct (db, aProductData){
    console.log(aProductData); 
   return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO "Product"("Data")
                 VALUES($1) returning "Data"`, aProductData, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
}

module.exports = {
    addProducts
}