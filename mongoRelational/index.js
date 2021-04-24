const {getRandomString, getRandomInteger} = require('../utils');

async function addRetailers (db, oModels){
    const aCountries =  await oModels.Country.find({}, {_id:1}).catch(console.log);
    console.log(aCountries);
    //while
    /* async function delay(iMillis) {
	return new Promise(resolve => setTimeout(resolve, iMillis));
}*/
    for (let i=0; i< 5; i++){
        await insertRetailer(db, aCountries, oModels);
    }   
}

async function insertRetailer (db, aCountries, oModels){
    const sName = getRandomString(getRandomInteger(1,51));
    const sTaxId = getRandomString(2).toUpperCase() + getRandomInteger(1000000000,10000000000).toString();
    const sEmail = getRandomString(getRandomInteger(1,11)) + '@' + getRandomString(getRandomInteger(1,10)) + '.com';  
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

/*async function addThumbnails (db){
    for (let i=0; i< 5; i++){
        await insertThumbnail(db);
    }    
}*/

async function insertThumbnail (oModels){
    const sName = getRandomString(getRandomInteger(1,51));
    const sData = getRandomString(getRandomInteger(999,1001));
    const oThumbnailData = {
        name: sName,
        data: sData
    };
    return new Promise ((resolve, reject) => {
        oModels.Thumbnail.create(oThumbnailData, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve(res);
            }
         });
    });
}

async function addProducts (db, oModels){
    const aStatuses =  await oModels.Status.find({}, {_id:1}).catch(console.log);
    const aRetailers =  await oModels.Retailer.find({}, {_id:1}).catch(console.log);
    const aTypes =  await oModels.Type.find({}, {_id:1}).catch(console.log);
    
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
       _id : oProduct._id
    };
   await update(oModels, "Product", oUpdateData, oConditionData); 
}

async function insertProduct (oModels, aStatuses, aRetailers, aTypes){
    const sName = getRandomString(getRandomInteger(1,51));
    const sDesctiption = getRandomString(getRandomInteger(1,51));
    const iStatusId =   aStatuses[Math.floor(Math.random() * aStatuses.length)]._id;
    const sDateAdded =  new Date(); 
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
   return new Promise ((resolve, reject) => {
    oModels.Product.create(oProduct, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

async function insertProductClassificationItem(oModels, oProduct){
    const aClassificationItems =  await oModels.ClassificationItem.find({}, {_id:1}).catch(console.log);
    const iClassificationItemId = aClassificationItems[Math.floor(Math.random() * aClassificationItems.length)]._id;
    const oProductClasItemData = {
        _productId: oProduct._id,
        _classificationItemId: iClassificationItemId
    };
    await oModels.ProductClassificationItem.create(oProductClasItemData).catch(console.log);

}

async function update(oModels, sTableToUpdate, oUpdateData, oConditionData){
    console.log(oConditionData);
    console.log(oUpdateData);
   oModels[sTableToUpdate].updateOne(oConditionData, {$set: oUpdateData}).catch(console.log);
}

module.exports = {
    addRetailers,
    addProducts
}