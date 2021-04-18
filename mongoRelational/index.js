const {getRandomString, getRandomInteger} = require('../utils');

async function addRetailers (db){
    const aCountries =  await db.collection("Country").find({}, {_id:1}).toArray().catch(console.log);
    const aCountryIds = aCountries.map(oCountry => oCountry._id);
    console.log(aCountryIds);
    for (let i=0; i< 5; i++){
        await insertRetailer(db, aCountryIds);
    }   
}

async function insertRetailer (db, aCountryIds){
    const sName = getRandomString(getRandomInteger(1,51));
    const sTaxId = getRandomString(2).toUpperCase() + getRandomInteger(1000000000,10000000000).toString();
    const sEmail = getRandomString(getRandomInteger(1,11)) + '@' + getRandomString(getRandomInteger(1,10)) + '.com';  
    const iCountryId = aCountryIds[Math.floor(Math.random() * aCountryIds.length)];
    const oRetailerData = {
        name: sName, 
        taxId: sTaxId,
        email: sEmail,
        _counrtyId: iCountryId
    };
    console.log(oRetailerData); 
    await db.collection("Retailer").insertOne(oRetailerData).catch(console.log);
}

/*async function addThumbnails (db){
    for (let i=0; i< 5; i++){
        await insertThumbnail(db);
    }    
}*/

async function insertThumbnail (db){
    const sName = getRandomString(getRandomInteger(1,51));
    const sData = getRandomString(getRandomInteger(999,1001));
    //gives utf8 error
    const sEncodedData = Buffer.from(sData, 'base64');
    const oThumbnailData = {
        name: sName,
        data: sData
    };
    return new Promise ((resolve, reject) => {
        db.collection("Thumbnail").insertOne(oThumbnailData, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve(res.ops[0]);
            }
         });
    });
}

async function addProducts (db){
    const aStatuses =  await db.collection("Status").find({}, {_id:1}).toArray().catch(console.log);
    const aStatusIds = aStatuses.map(oStatus => oStatus._id);
    const aRetailers =  await db.collection("Retailer").find({}, {_id:1}).toArray().catch(console.log);
    const aRetailerId = aRetailers.map(oRetailer => oRetailer._id);
    const aTypes =  await db.collection("Type").find({}, {_id:1}).toArray().catch(console.log);
    const aTypeIds = aTypes.map(oType => oType._id);
    
   const oProduct = await insertProduct(db, aStatusIds, aRetailerId, aTypeIds);
      console.log(oProduct);
   await insertProductClassificationItem(db, oProduct);
   const oThumbnail = await insertThumbnail(db);
   console.log(oThumbnail);
   const oUpdateData = {
       _thumbnailId: oThumbnail._id,
       description: 'Yuhuuu'
    };
   const oConditionData = {
       _id : oProduct._id
    };
   await update(db, "Product", oUpdateData, oConditionData); 
}

async function insertProduct (db, aStatusIds, aRetailerId, aTypeIds){
    const sName = getRandomString(getRandomInteger(1,51));
    const sDesctiption = getRandomString(getRandomInteger(1,51));
    const iStatusId =   aStatusIds[Math.floor(Math.random() * aStatusIds.length)];
    const sDateAdded =  new Date(); 
    const iRetailerId = aRetailerId[Math.floor(Math.random() * aRetailerId.length)];
    const iTypeId = aTypeIds[Math.floor(Math.random() * aTypeIds.length)];
    const oProduct = {
        name: sName,
        description: sDesctiption,
        _statusId: iStatusId,
        dateAdded: sDateAdded,        
        _retailerId: iRetailerId,
        _typeId: iTypeId
    };
    console.log(oProduct); 
   return new Promise ((resolve, reject) => {
    db.collection("Product").insertOne(oProduct, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve(res.ops[0]);
            }
        });
    });
}

async function insertProductClassificationItem(db, oProduct){
    const aClassificationItems =  await db.collection("ClassificationItem").find({}, {_id:1}).toArray().catch(console.log);
    const aClasItemIds = aClassificationItems.map(oClasItem => oClasItem._id);
    const iClassificationItemId = aClasItemIds[Math.floor(Math.random() * aClasItemIds.length)];
    const oProductClasItemData = {
        _productId: oProduct._id,
        _classificationItemId: iClassificationItemId
    };
    await db.collection("ProductClassificationItem").insertOne(oProductClasItemData).catch(console.log);

}

async function update(db, sTableToUpdate, oUpdateData, oConditionData){
    console.log(oConditionData);
    console.log(oUpdateData);

    db.collection(sTableToUpdate).updateOne(oConditionData, {$set: oUpdateData}).catch(console.log);
}

module.exports = {
    addRetailers,
    addProducts
}