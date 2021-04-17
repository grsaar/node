const {getRandomString, getRandomInteger} = require('../utils');

async function addRetailers (db){
    const aCountries =  await db.query(`SELECT * FROM "Country"`).catch(console.log);
    console.log(aCountries.rows);
    for (let i=0; i< 5; i++){
        await insertRetailer(db, aCountries.rows);
    }    
}

async function insertRetailer (db, aCountries){
    const sName = getRandomString(getRandomInteger(1,51));
    const sTaxId = getRandomString(2).toUpperCase() + getRandomInteger(1000000000,10000000000).toString();
    const sEmail = getRandomString(getRandomInteger(1,11)) + '@' + getRandomString(getRandomInteger(1,10)) + '.com';  
    const iCountryId =  getRandomInteger(1,aCountries.length + 1);
    const aRetailerData = [sName, sTaxId, sEmail, iCountryId];
    console.log(aRetailerData); 
    await db.query(`INSERT INTO "Retailer"("Name", "TaxId", "Email", "CountryId") VALUES($1,$2,$3,$4)`, aRetailerData).catch(console.log);
}

async function addThumbnails (db){
    for (let i=0; i< 5; i++){
        await insertThumbnail(db);
    }    
}
async function insertThumbnail (db){
    const sName = getRandomString(getRandomInteger(1,51));
    const sData = getRandomString(getRandomInteger(999,1001));
    const sEncodedData = Buffer.from(sData, 'base64');
    const aThumbnailData = [ sName, sEncodedData];
    console.log(aRetailerData); 
    await db.query(`INSERT INTO "Retailer"("Name", "Data") VALUES($1,$2)`, aThumbnailData).catch(console.log);
}

async function insertRetailer (db, aCountries){
    const sName = getRandomString(getRandomInteger(1,51));
    const sTaxId = getRandomString(2).toUpperCase() + getRandomInteger(1000000000,10000000000).toString();
    const sEmail = getRandomString(getRandomInteger(1,11)) + '@' + getRandomString(getRandomInteger(1,10)) + '.com';  
    const iCountryId =  getRandomInteger(1,aCountries.length + 1);
    const aRetailerData = [sName, sTaxId, sEmail, iCountryId];
    console.log(aRetailerData); 
    await db.query(`INSERT INTO "Retailer"("Name", "TaxId", "Email", "CountryId") VALUES($1,$2,$3,$4)`, aRetailerData).catch(console.log);
}

async function addProducts (db){
    const oStatusResult =  await db.query(`SELECT * FROM "Status"`).catch(console.log);
    const oRetailerResult =  await db.query(`SELECT * FROM "Retailer"`).catch(console.log);
    const oTypeResult =  await db.query(`SELECT * FROM "Type"`).catch(console.log);
   const oProduct = await insertProduct(db, oStatusResult.rows, oRetailerResult.rows, oTypeResult.rows);
   console.log(oProduct);
   
   //await addProductClassificationItem(db, oProduct);
}

async function insertProduct (db, aStatuses, aRetailers, aTypes){
    const sName = getRandomString(getRandomInteger(1,51));
    const sDesctiption = getRandomString(getRandomInteger(1,51));
    const iStatusId =   getRandomInteger(1, aStatuses.length + 1);  
    const sDateAdded =  new Date(); 
    const iRetailerId = getRandomInteger(1, aRetailers.length + 1);
    const iTypeId = getRandomInteger(1, aTypes.length + 1);  
    const aProductData = [sName, sDesctiption, iStatusId, sDateAdded, iRetailerId, iTypeId];
    console.log(aProductData); 
   return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO "Product"("Name", "Description", "StatusId", "DateAdded", "RetailerId", "TypeId")
                 VALUES($1,$2,$3,$4,$5,$6) returning "Id"`, aProductData, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve(res.rows);
            }
        })

    });
}

async function addProductClassificationItem(db, oProduct){

}

module.exports = {
    addRetailers,
    addProducts
}