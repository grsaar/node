const { Console } = require('console');
const { accessSync } = require('fs');
const {getRandomString, getRandomInteger} = require('../utils');

async function addProducts (db){
    const oStatusResult =  await db.query(`SELECT "InternalId", "Name" FROM "Status"`).catch(console.log);
    const oCountriesResult =  await db.query(`SELECT "InternalId", "Name" FROM "Country"`).catch(console.log);
    const oTypeResult =  await db.query(`SELECT "InternalId", "Name" FROM "Type"`).catch(console.log);
    const oClassificationItemsResult =  await db.query(`SELECT "InternalId", "Name", "HierarchyCode", "ClassificationId", "ParentId" FROM "Classification Item"`).catch(console.log);
    const oClassificationResult =  await db.query(`SELECT "InternalId", "Name" FROM "Classification"`).catch(console.log);
    
    const aProductData = prepareProductData(oStatusResult.rows, oCountriesResult.rows, oTypeResult.rows, oClassificationItemsResult.rows, oClassificationResult.rows);
    console.log(aProductData);
    const iInsertedRows = await insertProduct(db, aProductData);
      console.log(`Inserted ${iInsertedRows} product`);
}

function prepareProductData (aStatuses, aCountries, aTypes, aClassificationItems, aClassifications){
    const oStatus =   aStatuses[Math.floor(Math.random() * aStatuses.length)];
    const sDateAdded =  new Date(); 
    const oType = aTypes[Math.floor(Math.random() * aTypes.length)];
    const oClassificationItem = aClassificationItems[Math.floor(Math.random() * aClassificationItems.length)];
    const oClassification = aClassifications.find(oClassification => oClassification.InternalId === oClassificationItem.ClassificationId);
    oClassificationItem.classification = oClassification;
    delete oClassificationItem.ClassificationId;
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
        country: oCountry
    }

    //Generate random boolean to decide if thumbnail will be added or not
    const bAddThumbnail = getRandomInteger(0,2);
    const aProduct = [{
        name: getRandomString(getRandomInteger(1,51)),
        description: getRandomString(getRandomInteger(1,51)),
        status: oStatus,
        dateAdded: sDateAdded,        
        retailer: oRetailer,
        type: oType,
        classificationItems: [oClassificationItem],
        thumbnail: bAddThumbnail ? oThumbnail : null
    }];
    return aProduct;
}

async function insertProduct (db, aProductData){
   return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO "Product"("Data")
                 VALUES($1) returning "Data"`, aProductData, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve(res.rowCount);
            }
        });
    });
}

async function getCountryProducts(db){
    const oCountryResult = await db.query(`SELECT * FROM "Country" ORDER BY random() LIMIT 1`);
    const oProductResult =  await db.query(`SELECT * FROM "Product"
    WHERE ("Data" -> 'retailer' -> 'country' ->> 'InternalId')::int = ${oCountryResult.rows[0].InternalId}`).catch(console.log);
    console.log(`Get country products result: ${oProductResult.rowCount} rows`);
}

async function getProductsWithHierarchyCode(db){    
    const oClassificationItemResult = await db.query(`SELECT * FROM "Classification Item" ORDER BY random() LIMIT 1`);
    const sHierarchyCode = oClassificationItemResult.rows[0].HierarchyCode + '%';
    console.log(sHierarchyCode);
    const oProductResult = await db.query(`SELECT "Id" FROM "Product", 
                                        jsonb_array_elements(("Data"::jsonb)->'classificationItems') AS classificationItems(ClassificationItem)
                                        WHERE  (classificationItems.ClassificationItem ->> 'HierarchyCode') LIKE '${sHierarchyCode}'`)
                                                                            .catch(console.log);
    console.log(`Get products with HierarcyCode result: ${oProductResult.rowCount} rows`);                                   

}

async function getUnclassifiedProducts (db){
    const oUnclassifiedProductsResult = await db.query(`SELECT * FROM "Product"
                                                        WHERE "Product"."Data"->'classificationItems' is null`)
                                                        .catch(console.log);
    console.log(`Get unclassified products result: ${oUnclassifiedProductsResult.rows} rows`);                                                        
}

async function getProductsWithThumbnails (db){
    const oProductsWithThumbnailsResult = await db.query(`SELECT * FROM "Product"
                                                          WHERE "Product"."Data"->'thumbnail' is not null`).catch(console.log);
    console.log(`Get products with thumbnails result: ${oProductsWithThumbnailsResult.rowCount} rows`);                                                                                                                                                            
}

async function updateProductsStatuses (db){
    const aTypeResult = await db.query(`SELECT "InternalId" FROM "Type" ORDER BY random() LIMIT 1`).catch(console.log);
    const aStatusResult = await db.query(`SELECT * FROM "Status"`).catch(console.log);
    const oUpdateStatus = aStatusResult.rows[Math.floor(Math.random() * aStatusResult.rows.length)];
    const iConditionStatusId = aStatusResult.rows.find(oStatus => oStatus.InternalId !== oUpdateStatus.InternalId).InternalId;
    const oUpdateResult = await db.query(`UPDATE "Product"
                                    SET "Data" = jsonb_set("Data"::jsonb, '{status}', '{"InternalId": ${oUpdateStatus.InternalId}, "Name": "${oUpdateStatus.Name}"}')
                                    WHERE ("Data" -> 'status' ->> 'InternalId')::int = ${iConditionStatusId}
                                    AND ("Data" -> 'type' ->> 'InternalId')::int = ${aTypeResult.rows[0].InternalId}`).catch(console.log);
    console.log(`Updated status for ${oUpdateResult.rowCount} products`);                                
}

async function updateProductName(db){
    const oProductResult = await db.query(`SELECT "Id" FROM "Product" ORDER BY random() LIMIT 1`).catch(console.log);
    const sName = getRandomString(getRandomInteger(1, 51));
    console.log(oProductResult);
     const oUpdateResult = await db.query(`UPDATE "Product"
                                    SET "Data" = jsonb_set("Data"::jsonb, '{name}', '"${sName}"')
                                    WHERE "Product"."Id" = ${oProductResult.rows[0].Id}`).catch(console.log);
    console.log(`Updated name for ${oUpdateResult.rowCount} product`);                                  
}

async function deleteRandomProduct (db){
    const oProduct = await db.query(`SELECT * FROM "Product" ORDER BY random() LIMIT 1`);
    const oDeleteResult = await db.query(`DELETE FROM "Product"
                                        WHERE "Id" = ${oProduct.rows[0].Id}`)
                                        .catch(console.log);
    console.log(`Deleted ${oDeleteResult.rowCount} product`);                                 
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