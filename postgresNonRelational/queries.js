const { Console } = require('console');
const { accessSync } = require('fs');
const {getRandomString, getRandomInteger} = require('../utils');

async function addProduct (db){
    const oStatusResult =  await db.query(`SELECT "InternalId", "Name" FROM "Status"`).catch(console.log);
    const oCountriesResult =  await db.query(`SELECT "InternalId", "Name" FROM "Country"`).catch(console.log);
    const oTypeResult =  await db.query(`SELECT "InternalId", "Name" FROM "Type"`).catch(console.log);
    const oClassificationItemsResult =  await db.query(`SELECT "InternalId", "Name", "HierarchyCode", "ClassificationId", "ParentId" FROM "ClassificationItem"`).catch(console.log);
    const oClassificationResult =  await db.query(`SELECT "InternalId", "Name" FROM "Classification"`).catch(console.log);
    
    const aProductData = prepareProductData(oStatusResult.rows, oCountriesResult.rows, oTypeResult.rows, oClassificationItemsResult.rows, oClassificationResult.rows);
   
    const aProductResult = await insertProduct(db, aProductData);
    //console.log(`Inserted ${aProductResult[0].rowCount} product`);
    //console.log(`Elapse time ${aProductResult[2] - aProductResult[1]}`);
    return {
        ExecutedQuery: 'Insert product',
        ResultCount: aProductResult[0].rowCount,
        ElapseTime: aProductResult[2] - aProductResult[1],
        TimeStamp: new Date(aProductResult[1]) 
    };
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

    const aProduct = [{
        name: getRandomString(getRandomInteger(1,51)),
        description: getRandomString(getRandomInteger(1,51)),
        status: oStatus,
        dateAdded: sDateAdded,        
        retailer: oRetailer,
        type: oType,
        classificationItems: getRandomInteger(0,2) ? [oClassificationItem] : [], //Generate random boolean to decide if classificationItem will be added or not
        thumbnail: getRandomInteger(0,2) ? oThumbnail : null
    }];
    return aProduct;
}

async function insertProduct (db, aProductData){
    const sQueryStartTimestamp = Date.now();

   return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO "Product"("Data")
                 VALUES($1) returning "Data"`, aProductData, (err, res) => {
            if(err){
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
            }
        });
    });
}

async function getCountryProducts(db){
    const oCountryResult = await db.query(`SELECT "InternalId" FROM "Country" ORDER BY random() LIMIT 1`);
    const sQueryStartTimestamp = Date.now();

    const oProductResult =  await db.query(`SELECT * FROM "Product"
                                            WHERE ("Data" -> 'retailer' -> 'country' ->> 'InternalId')::int = ${oCountryResult.rows[0].InternalId}`)
                                            .catch(console.log);
    const sQueryEndTimestamp = Date.now();
   //console.log(`Get country products result: ${oProductResult.rowCount} rows`);
    //console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get counrty products',
        ResultCount: oProductResult.rowCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };
}

async function getProductsWithHierarchyCode(db){    
    const oClassificationItemResult = await db.query(`SELECT "HierarchyCode" FROM "ClassificationItem" ORDER BY random() LIMIT 1`);
    const sHierarchyCode = oClassificationItemResult.rows[0].HierarchyCode + '%';
    const sQueryStartTimestamp = Date.now();
    
    const oProductResult = await db.query(`SELECT * FROM "Product", 
                                        jsonb_array_elements(("Data"::jsonb)->'classificationItems') AS classificationItems(ClassificationItem)
                                        WHERE  (classificationItems.ClassificationItem ->> 'HierarchyCode') LIKE '${sHierarchyCode}'`)
                                                                            .catch(console.log);   
    const sQueryEndTimestamp = Date.now();                                                                                                                        
   // console.log(`Get products with HierarcyCode result: ${oProductResult.rowCount} rows`);                    
   // console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get products with hierarchyCode',
        ResultCount: oProductResult.rowCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp)
    };                

}

async function getUnclassifiedProducts (db){
    const sQueryStartTimestamp = Date.now();
    const oUnclassifiedProductsResult = await db.query(`SELECT * FROM "Product"
                                                        WHERE jsonb_array_length(("Product"."Data"::jsonb)->'classificationItems') = 0`)
                                                        .catch(console.log);
    const sQueryEndTimestamp = Date.now();    
   // console.log(`Get unclassified products result: ${oUnclassifiedProductsResult.rowCount} rows`); 
   // console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);  
    return {
        ExecutedQuery: 'Get unclassified products',
        ResultCount: oUnclassifiedProductsResult.rowCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp)
    };                                                     
}

async function getProductsWithThumbnails (db){
    const sQueryStartTimestamp = Date.now();
    const oProductsWithThumbnailsResult = await db.query(`SELECT * FROM "Product"
                                                          WHERE "Product"."Data"->'thumbnail' is not null`).catch(console.log);
    const sQueryEndTimestamp = Date.now(); 
    console.log(`Get products with thumbnails result: ${oProductsWithThumbnailsResult.rowCount} rows`);  
   // console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`); 
    return {
        ExecutedQuery: 'Get products with thumbnails',
        ResultCount: oProductsWithThumbnailsResult.rowCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp)
    };                                                                                                                                                           
}

async function getProductCount(db) {
    const sQueryStartTimestamp = Date.now();
    const oCountResult =  await db.query(`SELECT COUNT(*) FROM "Product"`).catch(console.log);
    const sQueryEndTimestamp = Date.now(); 
    console.log(`Get products count: ${oCountResult.rows[0].count} rows`);
    return {
        ExecutedQuery: 'Get product count',
        ResultCount: oCountResult.rows[0].count,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(Date.now()) 
    }
}

async function updateProductsStatuses (db){
    const aTypeResult = await db.query(`SELECT "InternalId" FROM "Type" ORDER BY random() LIMIT 1`).catch(console.log);
    const aStatusResult = await db.query(`SELECT * FROM "Status"`).catch(console.log);
    const oUpdateStatus = aStatusResult.rows[Math.floor(Math.random() * aStatusResult.rows.length)];
    const iConditionStatusId = aStatusResult.rows.find(oStatus => oStatus.InternalId !== oUpdateStatus.InternalId).InternalId;
    const sQueryStartTimestamp = Date.now();

    const oUpdateResult = await db.query(`UPDATE "Product"
                                    SET "Data" = jsonb_set("Data"::jsonb, '{status}', '{"InternalId": ${oUpdateStatus.InternalId}, "Name": "${oUpdateStatus.Name}"}')
                                    WHERE ("Data" -> 'status' ->> 'InternalId')::int = ${iConditionStatusId}
                                    AND ("Data" -> 'type' ->> 'InternalId')::int = ${aTypeResult.rows[0].InternalId}`).catch(console.log);
    const sQueryEndTimestamp = Date.now();
    //console.log(`Updated status for ${oUpdateResult.rowCount} products`); 
    //console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);  
    return {
        ExecutedQuery: 'Update product statuses',
        ResultCount: oUpdateResult.rowCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };                                 
}

async function updateProductName(db){
    const oProductResult = await db.query(`SELECT "Id" FROM "Product" ORDER BY random() LIMIT 1`).catch(console.log);
    const sName = getRandomString(getRandomInteger(1, 51));
    const sQueryStartTimestamp = Date.now();

     const oUpdateResult = await db.query(`UPDATE "Product"
                                    SET "Data" = jsonb_set("Data"::jsonb, '{name}', '"${sName}"')
                                    WHERE "Product"."Id" = ${oProductResult.rows[0].Id}`).catch(console.log);
    const sQueryEndTimestamp = Date.now(); 
    //console.log(`Updated name for ${oUpdateResult.rowCount} product`);                                  
    //console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`); 
    return {
        ExecutedQuery: 'Update product name',
        ResultCount: oUpdateResult.rowCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp,
        TimeStamp: new Date(sQueryStartTimestamp) 
    };
}

async function deleteRandomProduct (db){
    const sQueryStartTimestamp = Date.now();
    const oProduct = await db.query(`SELECT * FROM "Product" ORDER BY random() LIMIT 1`);
    const oDeleteResult = await db.query(`DELETE FROM "Product"
                                        WHERE "Id" = ${oProduct.rows[0].Id}`).catch(console.log);
    const sQueryEndTimestamp = Date.now();
   // console.log(`Deleted ${oDeleteResult.rowCount} product`);
   // console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`); 
    return {
        ExecutedQuery: 'Delete product',
        ResultCount: oDeleteResult.rowCount,
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