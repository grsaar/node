const { Console } = require('console');
const { accessSync } = require('fs');
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
    //remove system id, keep only internalId
    delete oStatus.Id;
    const sDateAdded =  new Date(); 
    const oType = aTypes[Math.floor(Math.random() * aTypes.length)];
    delete oType.Id;
    const oClassificationItem = aClassificationItems[Math.floor(Math.random() * aClassificationItems.length)];
    const oClassification = aClassifications.find(oClassification => oClassification.internalId === oClassificationItem.classificationId);
    delete oClassificationItem.Id;
    delete oClassification.Id;
    oClassificationItem.classification = oClassification;
    const sThumbnailName = getRandomString(getRandomInteger(1,51));
    const sThumbnailData = getRandomString(getRandomInteger(1000,10000));
    const oThumbnail = {
        name: sThumbnailName,
        data: sThumbnailData
    };
    const oCountry = aCountries[Math.floor(Math.random() * aCountries.length)];
    delete oCountry.Id;
    const oRetailer = {
        name: getRandomString(getRandomInteger(1,51)), 
        taxId: getRandomString(2).toUpperCase() + getRandomInteger(1000000000,10000000000).toString(),
        email: getRandomString(getRandomInteger(1,11)) + '@' + getRandomString(getRandomInteger(1,10)) + '.com',
        country: oCountry
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

async function getCountryProducts(db){
    const iCountryId = getRandomInteger(1,198);
    console.log(iCountryId);
    const oResult =  await db.query(`SELECT * FROM "Product"
    WHERE ("Data" -> 'retailer' -> 'country' ->> 'InternalId')::int = ${iCountryId}`).catch(console.log);
    console.log(oResult.rows);
}

async function getProductsWithHierarchyCode(db){    
    const oClassificationItem = await db.query(`SELECT * FROM "Classification Item" ORDER BY random() LIMIT 1`);
    const sHierarchyCode = oClassificationItem.rows[0].HierarchyCode + '%';
    console.log(sHierarchyCode);
    const oProductResult = await db.query(`SELECT * FROM "Product", jsonb_to_recordset(Product.Data.classificationItems) 
                                        AS clItems(HierarchyCode)
                                        WHERE clItems.HierarchyCode LIKE '243,%'`) //no
                                    .catch(console.log);
    console.log(oProductResult.rows);                                   

}

async function getUnclassifiedProducts (db){
    const oUnclassifiedProductsResult = await db.query(`SELECT * FROM "Product"
                                                        WHERE "Product"."Data"->'classificationItems' is null`)
                                                        .catch(console.log);
    console.log(oUnclassifiedProductsResult.rows);                                                        
}

async function getProductsWithThumbnails (db){
    const oProductsMissingThumbnailsResult = await db.query(`SELECT * FROM "Product"
                                                            WHERE "Product"."Data"->'thumbnail' is not null`)
                                                         .catch(console.log);                                                         
   /* if(oProductsMissingThumbnailsResult.rows.length){
        oProductsMissingThumbnailsResult.rows.forEach(async function (oProduct){
            //?
        });
    }    */                                                     
}

async function updateProductsStatuses (db){
    const aTypeResult = await db.query(`SELECT "InternalId" FROM "Type" ORDER BY random() LIMIT 1`).catch(console.log);
    const aStatusResult = await db.query(`SELECT * FROM "Status"`).catch(console.log);
    const oUpdateStatus = aStatusResult.rows[Math.floor(Math.random() * aStatusResult.rows.length)];
    const iConditionStatusId = aStatusResult.rows.find(oStatus => oStatus.InternalId !== oUpdateStatus.InternalId).InternalId;
    const oResult = await db.query(`UPDATE "Product"
                                    SET "Data" = jsonb_set("Data"::jsonb, '{status}', '{"InternalId": ${oUpdateStatus.InternalId}, "Name": "${oUpdateStatus.Name}"}')
                                    WHERE ("Data" -> 'status' ->> 'InternalId')::int = ${iConditionStatusId}
                                    AND ("Data" -> 'type' ->> 'InternalId')::int = ${aTypeResult.rows[0].InternalId}`).catch(console.log);
    console.log(oResult);                                
}

async function updateProductName(db){
    const oProductResult = await db.query(`SELECT "Id" FROM "Product" ORDER BY random() LIMIT 1`).catch(console.log);
    const sName = getRandomString(getRandomInteger(1, 51));
    console.log(oProductResult);
     const oResult = await db.query(`UPDATE "Product"
                                    SET "Data" = jsonb_set("Data"::jsonb, '{name}', '"${sName}"')
                                    WHERE "Product"."Id" = ${oProductResult.rows[0].Id}`).catch(console.log);
    console.log(oResult);                                  
}

async function deleteRandomProduct (db){
    const oProduct = await db.query(`SELECT * FROM "Product" ORDER BY random() LIMIT 1`);
    await db.query(`DELETE FROM "Product"
                    WHERE "Id" = ${oProduct.rows[0].Id}`)
                    .catch(console.log);

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