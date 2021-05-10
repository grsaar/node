const { getRandomString, getRandomInteger } = require('../utils');

async function addRetailer(db) {
    const oCountryResult = await db.query(`SELECT "Id" FROM "Country"`).catch(console.log);
    const aCountryIds = oCountryResult.rows.map(oCountry => oCountry.Id);
    const aRetailerResult = await insertRetailer(db, aCountryIds);

    console.log(`Inserted ${aRetailerResult[0].rowCount} Retailer`);
    console.log(`Elapse time ${aRetailerResult[2] - aRetailerResult[1]}`);
    return {
        ExecutedQuery: 'Insert retailer',
        ResultCount: aRetailerResult[0].rowCount,
        ElapseTime: aRetailerResult[2] - aRetailerResult[1] 
    };
}

async function insertRetailer(db, aCountryIds) {
    const sName = getRandomString(getRandomInteger(1, 51));
    const sTaxId = getRandomString(2).toUpperCase() + getRandomInteger(1000000000, 10000000000).toString();
    const sEmail = getRandomString(getRandomInteger(1, 11)) + '@' + getRandomString(getRandomInteger(1, 10)) + '.com';
    const iCountryId = aCountryIds[Math.floor(Math.random() * aCountryIds.length)];
    const aRetailerData = [sName, sTaxId, sEmail, iCountryId];
    const sQueryStartTimestamp = Date.now();

    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO "Retailer"("Name", "TaxId", "Email", "CountryId") VALUES($1,$2,$3,$4)`, aRetailerData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
            }
        });
    });
}

async function insertThumbnail(db) {
    const sName = getRandomString(getRandomInteger(1, 51));
    const sData = getRandomString(getRandomInteger(999, 1001));
    const aThumbnailData = [sName, sData];
    const sQueryStartTimestamp = Date.now();

    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO "Thumbnail"("Name", "Data") VALUES($1,$2) returning "Id"`, aThumbnailData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
            }
        });
    });
}

async function addProduct(db) {
    const oStatusResult = await db.query(`SELECT "Id" FROM "Status"`).catch(console.log);
    const aStatusIds = oStatusResult.rows.map(oStatus => oStatus.Id);
    const oRetailerResult = await db.query(`SELECT "Id" FROM "Retailer"`).catch(console.log);
    const aRetailerIds = oRetailerResult.rows.map(oRetailer => oRetailer.Id);
    const oTypeResult = await db.query(`SELECT * FROM "Type"`).catch(console.log);
    const aTypeIds = oTypeResult.rows.map(oType => oType.Id);

    const aProductResult = await insertProduct(db, aStatusIds, aRetailerIds, aTypeIds);
    const oProduct = aProductResult[0];
    console.log(`Inserted ${oProduct.rowCount} Product`);
    console.log(`Elapse time ${aProductResult[2] - aProductResult[1]}`);
    const aResultsToReturn = [
        {
            ExecutedQuery: 'Insert product',
            ResultCount: oProduct.rowCount,
            ElapseTime: aProductResult[2] - aProductResult[1] 
        }
    ];

    //Generate random boolean to decide if classificationItem will be added or not
    if (getRandomInteger(0, 2)) {
        const aProductClassificationItemResult = await insertProductClassificationItem(db, oProduct.rows[0]);
        console.log(`Inserted ${aProductClassificationItemResult[0].rowCount} Product Classification Item`);
        console.log(`Elapse time ${aProductClassificationItemResult[2] - aProductClassificationItemResult[1]}`);
        aResultsToReturn.push({
            ExecutedQuery: 'Insert product classification item',
            ResultCount: aProductClassificationItemResult[0].rowCount,
            ElapseTime: aProductClassificationItemResult[2] - aProductClassificationItemResult[1] 
        });
    }

    if (getRandomInteger(0, 2)) {
        const aThumbnailResult = await insertThumbnail(db);
        const oThumbnailResult = aThumbnailResult[0]; 
        console.log(`Inserted ${oThumbnailResult.rowCount} Thumbnail`);
        console.log(`Elapse time ${aThumbnailResult[2] - aThumbnailResult[1]}`);
        aResultsToReturn.push({
            ExecutedQuery: 'Insert thumbnail',
            ResultCount: oThumbnailResult.rowCount,
            ElapseTime: aThumbnailResult[2] - aThumbnailResult[1] 
        });

        const oThumbnail = oThumbnailResult.rows[0];
        const oUpdateData = {
            'ThumbnailId': oThumbnail.Id
        };
        const oConditionData = { "Id": oProduct.rows[0].Id };
        const aUpdateResult = await update(db, "Product", oUpdateData, oConditionData);
        console.log(`Updated ${aUpdateResult[0].rowCount} row(s) in Product table`);
        console.log(`Elapse time ${aUpdateResult[2] - aUpdateResult[1]}`);
        aResultsToReturn.push({
            ExecutedQuery: 'Update product',
            ResultCount: aUpdateResult[0].rowCount,
            ElapseTime: aUpdateResult[2] - aUpdateResult[1] 
        });
    }
    return aResultsToReturn;
}

async function insertProduct(db, aStatusIds, aRetailerIds, aTypeIds) {
    const sName = getRandomString(getRandomInteger(1, 51));
    const sDesctiption = getRandomString(getRandomInteger(1, 51));
    const iStatusId = aStatusIds[Math.floor(Math.random() * aStatusIds.length)];
    const sDateAdded = new Date();
    const iRetailerId = aRetailerIds[Math.floor(Math.random() * aRetailerIds.length)];
    const iTypeId = aTypeIds[Math.floor(Math.random() * aTypeIds.length)];
    const aProductData = [sName, sDesctiption, iStatusId, sDateAdded, iRetailerId, iTypeId];
    const sQueryStartTimestamp = Date.now();

    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO "Product"("Name", "Description", "StatusId", "DateAdded", "RetailerId", "TypeId")
                 VALUES($1,$2,$3,$4,$5,$6) returning "Id"`, aProductData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
            }
        });
    });
}

async function insertProductClassificationItem(db, oProduct) {
    const oClassificationItemResult = await db.query(`SELECT * FROM "Classification Item"`).catch(console.log);
    const aClasItemIds = oClassificationItemResult.rows.map(oClasItem => oClasItem.Id);
    const iClassificationItemId = aClasItemIds[Math.floor(Math.random() * aClasItemIds.length)];
    const aProductClasItemData = [oProduct.Id, iClassificationItemId];
    const sQueryStartTimestamp = Date.now();

    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO "Product Classification Item"("ProductId", "ClassificationItemId") VALUES($1,$2)`, aProductClasItemData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve([res, sQueryStartTimestamp, Date.now()]);
            }
        });
    });

}

//dynamic update, currently only with "=" operator
async function update(db, sTableToUpdate, oUpdateData, oConditionData) {
    let sSetQuery = '';
    Object.keys(oUpdateData).forEach(sKey => {
        if (typeof oUpdateData[sKey] === 'string') {
            sSetQuery += ` "${sKey}" = '${oUpdateData[sKey]}', `;
        } else {
            sSetQuery += ` "${sKey}" = ${oUpdateData[sKey]}, `;
        }
    });
    //to remove last comma separator 
    sSetQuery = sSetQuery.substring(0, sSetQuery.length - 2);

    let sConditionQuery = ``;
    Object.keys(oConditionData).forEach(sKey => {
        if (typeof oConditionData[sKey] === 'string') {
            sConditionQuery += ` "${sKey}" = '${oConditionData[sKey]}' AND `;
        } else {
            sConditionQuery += ` "${sKey}" = ${oConditionData[sKey]} AND `;
        }
    });
    //to remove last 'AND'
    sConditionQuery = sConditionQuery.substring(0, sConditionQuery.length - 4);
    const sQueryStartTimestamp = Date.now();

    //console.log(`UPDATE "${sTableToUpdate}" SET ${sSetQuery} WHERE ${sConditionQuery}`);
    return new Promise((resolve, reject) => {
         db.query(`UPDATE "${sTableToUpdate}" SET ${sSetQuery} WHERE ${sConditionQuery}`, (err, res) => {
             if(err){
                 reject(err);
             } else {
                 resolve([res, sQueryStartTimestamp, Date.now()]);
             }
         }) 
    });     
}

async function getCountryProducts(db) {
    const oCountryResult = await db.query(`SELECT "Id" FROM "Country" ORDER BY random() LIMIT 1`);
    const sQueryStartTimestamp = Date.now();
    const oProductResult = await db.query(`SELECT * FROM "Country" 
                                            LEFT JOIN "Retailer" ON "Country"."Id" = "Retailer"."CountryId"
                                            LEFT JOIN "Product" ON "Product"."RetailerId" = "Retailer"."Id"
                                            WHERE "Country"."Id" = ${oCountryResult.rows[0].Id}`).catch(console.log);

    const sQueryEndTimestamp = Date.now();
    console.log(`Get country products result: ${oProductResult.rowCount} rows`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get counrty products',
        ResultCount: oProductResult.rowCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp 
    };
}


async function getProductsWithHierarchyCode(db) {
    const oClassificationItem = await db.query(`SELECT "HierarchyCode" FROM "Classification Item" ORDER BY random() LIMIT 1`);
    const sHierarchyCode = oClassificationItem.rows[0].HierarchyCode + '%';
    const sQueryStartTimestamp = Date.now();
    const oProductResult = await db.query(`SELECT * FROM "Classification Item" INNER JOIN ("Product Classification Item" 
                                            INNER JOIN "Product" ON "Product"."Id" = "Product Classification Item"."ProductId") 
                                            ON "Product Classification Item"."ClassificationItemId" = "Classification Item"."Id"
                                            WHERE "Classification Item"."HierarchyCode" LIKE '${sHierarchyCode}'`).catch(console.log);                                            
    const sQueryEndTimestamp = Date.now();
    console.log(`Get products with HierarcyCode result: ${oProductResult.rowCount} rows`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);    
    return {
        ExecutedQuery: 'Get products with hierarchyCode',
        ResultCount: oProductResult.rowCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp 
    };

}

async function getUnclassifiedProducts(db) {
    const sQueryStartTimestamp = Date.now();
    const oUnclassifiedProductsResult = await db.query(`SELECT * FROM "Product"
                                                        LEFT JOIN "Product Classification Item"
                                                        ON "Product"."Id" = "Product Classification Item"."ProductId"
                                                        WHERE "Product Classification Item"."ProductId" IS NULL`).catch(console.log);

    const sQueryEndTimestamp = Date.now();                                                    
    console.log(`Get unclassified products result: ${oUnclassifiedProductsResult.rows.length} rows`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get unclassified products',
        ResultCount: oUnclassifiedProductsResult.rows.length,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp 
    };
}

async function getProductsWithThumbnails(db) {
    const sQueryStartTimestamp = Date.now();
    const oProductsWithThumbnailsResult = await db.query(`SELECT * FROM "Product" 
                                                         WHERE "Product"."ThumbnailId" IS NOT NULL`).catch(console.log);

    const sQueryEndTimestamp = Date.now();                       
    console.log(`Get products with thumbnails result: ${oProductsWithThumbnailsResult.rowCount} rows`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Get products with thumbnails',
        ResultCount: oProductsWithThumbnailsResult.length,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp 
    };
}

async function getProductCount(db) {
    return await db.query(`SELECT COUNT(*) FROM "Product"`).catch(console.log);
}

async function getRetailerCount(db) {
    return await db.query(`SELECT COUNT(*) FROM "Retailer"`).catch(console.log);
}

async function updateProductsStatuses(db) {
    const aTypeResult = await db.query(`SELECT "Id" FROM "Type" ORDER BY random() LIMIT 1`).catch(console.log);
    const oStatusResult = await db.query(`SELECT "Id" FROM "Status"`).catch(console.log);
    const aStatusIds = oStatusResult.rows.map(oStatus => oStatus.Id);
    const iUpdateStatusId = aStatusIds[Math.floor(Math.random() * aStatusIds.length)];
    const iConditionStatusId = aStatusIds.find(iStatusId => iStatusId !== iUpdateStatusId);
    const oUpdateData = {
        "StatusId": iUpdateStatusId
    };
    const oConditionData = {
        "TypeId": aTypeResult.rows[0].Id,
        "StatusId": iConditionStatusId
    };

   const aUpdateResult = await update(db, "Product", oUpdateData, oConditionData);
   console.log(`Updated ${aUpdateResult[0].rowCount} row(s) in Product table`);
   console.log(`Elapse time ${aUpdateResult[2] - aUpdateResult[1]}`);
   return {
    ExecutedQuery: 'Update product statuses',
    ResultCount: aUpdateResult[0].rowCount,
    ElapseTime: aUpdateResult[2] - aUpdateResult[1] 
};
}

async function updateProductName(db) {
    const oProductResult = await db.query(`SELECT "Id" FROM "Product" ORDER BY random() LIMIT 1`).catch(console.log);
    const oUpdateData = {
        "Name": getRandomString(getRandomInteger(1, 51)),
    };
    const oConditionData = {
        "Id": oProductResult.rows[0].Id
    };
    const aUpdateResult = await update(db, "Product", oUpdateData, oConditionData);
    console.log(`Updated ${aUpdateResult[0].rowCount} row(s) in Product table`);
    console.log(`Elapse time ${aUpdateResult[2] - aUpdateResult[1]}`);
    return {
        ExecutedQuery: 'Update product name',
        ResultCount: aUpdateResult[0].rowCount,
        ElapseTime: aUpdateResult[2] - aUpdateResult[1] 
    };
}

async function deleteRandomProduct(db) {
    const oProduct = await db.query(`SELECT "Id" FROM "Product" ORDER BY random() LIMIT 1`);
    const sQueryStartTimestamp = Date.now();
    const oDeleteResult = await db.query(`DELETE FROM "Product"
                    WHERE "Id" = ${oProduct.rows[0].Id}`).catch(console.log);

    const sQueryEndTimestamp = Date.now();
    console.log(`Deleted ${oDeleteResult.rowCount} product(s)`);
    console.log(`Elapse time ${sQueryEndTimestamp - sQueryStartTimestamp}`);
    return {
        ExecutedQuery: 'Delete product',
        ResultCount: oDeleteResult.rowCount,
        ElapseTime: sQueryEndTimestamp - sQueryStartTimestamp 
    };
}

module.exports = {
    addRetailer,
    addProduct,
    getCountryProducts,
    getProductsWithHierarchyCode,
    getUnclassifiedProducts,
    getProductsWithThumbnails,
    getProductCount,
    getRetailerCount,
    updateProductsStatuses,
    updateProductName,
    deleteRandomProduct
}