const { getRandomString, getRandomInteger } = require('../utils');

async function addRetailer(db) {
    const oCountryResult = await db.query(`SELECT "Id" FROM "Country"`).catch(console.log);
    const aCountryIds = oCountryResult.rows.map(oCountry => oCountry.Id);
    const iInsertedRows = await insertRetailer(db, aCountryIds);
    console.log(`Inserted ${iInsertedRows} Retailer`);
}

async function insertRetailer(db, aCountryIds) {
    const sName = getRandomString(getRandomInteger(1, 51));
    const sTaxId = getRandomString(2).toUpperCase() + getRandomInteger(1000000000, 10000000000).toString();
    const sEmail = getRandomString(getRandomInteger(1, 11)) + '@' + getRandomString(getRandomInteger(1, 10)) + '.com';
    const iCountryId = aCountryIds[Math.floor(Math.random() * aCountryIds.length)];
    const aRetailerData = [sName, sTaxId, sEmail, iCountryId];
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO "Retailer"("Name", "TaxId", "Email", "CountryId") VALUES($1,$2,$3,$4)`, aRetailerData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rowCount);
            }
        });
    });
}

async function insertThumbnail(db) {
    const sName = getRandomString(getRandomInteger(1, 51));
    const sData = getRandomString(getRandomInteger(999, 1001));
    const aThumbnailData = [sName, sData];
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO "Thumbnail"("Name", "Data") VALUES($1,$2) returning "Id"`, aThumbnailData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
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

    const oProductResult = await insertProduct(db, aStatusIds, aRetailerIds, aTypeIds);
    console.log(`Inserted ${oProductResult.rowCount} Product`);

    //Generate random boolean to decide if classificationItem will be added or not
    if (getRandomInteger(0, 2)) {
        const oProductClassificationItemResult = await insertProductClassificationItem(db, oProductResult.rows[0]);
        console.log(`Inserted ${oProductClassificationItemResult.rowCount} Product Classification Item`);
    }

    if (getRandomInteger(0, 2)) {
        const oThumbnailResult = await insertThumbnail(db);
        console.log(`Inserted ${oThumbnailResult.rowCount} Thumbnail`);

        const oThumbnail = oThumbnailResult.rows[0];
        const oUpdateData = {
            'ThumbnailId': oThumbnail.Id
        };
        const oConditionData = { "Id": oProductResult.rows[0].Id };
        await update(db, "Product", oUpdateData, oConditionData);
    }
}

async function insertProduct(db, aStatusIds, aRetailerIds, aTypeIds) {
    const sName = getRandomString(getRandomInteger(1, 51));
    const sDesctiption = getRandomString(getRandomInteger(1, 51));
    const iStatusId = aStatusIds[Math.floor(Math.random() * aStatusIds.length)];
    const sDateAdded = new Date();
    const iRetailerId = aRetailerIds[Math.floor(Math.random() * aRetailerIds.length)];
    const iTypeId = aTypeIds[Math.floor(Math.random() * aTypeIds.length)];
    const aProductData = [sName, sDesctiption, iStatusId, sDateAdded, iRetailerId, iTypeId];
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO "Product"("Name", "Description", "StatusId", "DateAdded", "RetailerId", "TypeId")
                 VALUES($1,$2,$3,$4,$5,$6) returning "Id"`, aProductData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

async function insertProductClassificationItem(db, oProduct) {
    const oClassificationItemResult = await db.query(`SELECT * FROM "Classification Item"`).catch(console.log);
    const aClasItemIds = oClassificationItemResult.rows.map(oClasItem => oClasItem.Id);
    const iClassificationItemId = aClasItemIds[Math.floor(Math.random() * aClasItemIds.length)];
    const aProductClasItemData = [oProduct.Id, iClassificationItemId];

    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO "Product Classification Item"("ProductId", "ClassificationItemId") VALUES($1,$2)`, aProductClasItemData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
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

    //console.log(`UPDATE "${sTableToUpdate}" SET ${sSetQuery} WHERE ${sConditionQuery}`);
    const oUpdateResult = await db.query(`UPDATE "${sTableToUpdate}" SET ${sSetQuery} WHERE ${sConditionQuery}`).catch(console.log);

    console.log(`Updated ${oUpdateResult.rowCount} row(s) in ${sTableToUpdate} table`);
}

async function getCountryProducts(db) {
    const iCountryId = getRandomInteger(1, 198);
    const oProductResult = await db.query(`SELECT "Country"."Id" AS "CountryId", "Retailer"."Id" AS "RetailerId", "Product".* FROM "Country" 
                                            LEFT JOIN "Retailer" ON "Country"."Id" = "Retailer"."CountryId"
                                            LEFT JOIN "Product" ON "Product"."RetailerId" = "Retailer"."Id"
                                            WHERE "Country"."Id" = ${iCountryId}`).catch(console.log);
    console.log(`Get country products result: ${oProductResult.rowCount} rows`);
}


async function getProductsWithHierarchyCode(db) {
    const oClassificationItem = await db.query(`SELECT * FROM "Classification Item" ORDER BY random() LIMIT 1`);
    const sHierarchyCode = oClassificationItem.rows[0].HierarchyCode + '%';
    console.log(sHierarchyCode);
    const oProductResult = await db.query(`SELECT "Product".*, "Classification Item"."HierarchyCode", "Classification Item"."Id" FROM "Classification Item" INNER JOIN ("Product Classification Item" 
                                            INNER JOIN "Product" ON "Product"."Id" = "Product Classification Item"."ProductId") 
                                            ON "Product Classification Item"."ClassificationItemId" = "Classification Item"."Id"
                                            WHERE "Classification Item"."HierarchyCode" LIKE '${sHierarchyCode}'`).catch(console.log);
    console.log(`Get products with HierarcyCode result: ${oProductResult.rowCount} rows`);

}

async function getUnclassifiedProducts(db) {
    const oUnclassifiedProductsResult = await db.query(`SELECT * FROM "Product"
                                                        LEFT JOIN "Product Classification Item"
                                                        ON "Product"."Id" = "Product Classification Item"."ProductId"
                                                        WHERE "Product Classification Item"."ProductId" IS NULL`).catch(console.log);
    console.log(`Get unclassified products result: ${oUnclassifiedProductsResult.rows.length} rows`);
}

async function getProductsWithThumbnails(db) {
    const oProductsWithThumbnailsResult = await db.query(`SELECT * FROM "Product" 
                                                         WHERE "Product"."ThumbnailId" IS NOT NULL`).catch(console.log);
    console.log(`Get products with thumbnails result: ${oProductsWithThumbnailsResult.rowCount} rows`);
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

    update(db, "Product", oUpdateData, oConditionData);
}

async function updateProductName(db) {
    const oProductResult = await db.query(`SELECT "Id" FROM "Product" ORDER BY random() LIMIT 1`).catch(console.log);
    const oUpdateData = {
        "Name": getRandomString(getRandomInteger(1, 51)),
    };
    const oConditionData = {
        "Id": oProductResult.rows[0].Id
    };
    update(db, "Product", oUpdateData, oConditionData);
}

async function deleteRandomProduct(db) {
    const oProduct = await db.query(`SELECT * FROM "Product" ORDER BY random() LIMIT 1`);
    const oDeleteResult = await db.query(`DELETE FROM "Product"
                    WHERE "Id" = ${oProduct.rows[0].Id}`).catch(console.log);
    console.log(`Deleted ${oDeleteResult.rowCount} product(s)`);
}

module.exports = {
    addRetailer,
    addProduct,
    getCountryProducts,
    getProductsWithHierarchyCode,
    getUnclassifiedProducts,
    getProductsWithThumbnails,
    updateProductsStatuses,
    updateProductName,
    deleteRandomProduct
}