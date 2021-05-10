const {addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const fs = require('fs');
const json2Csv = require('json2csv').parse;

async function executeQueries (db){
  /* const oResult = await getProductCount(db);
  await writeToFile('../queryExecResult.txt', `Product count ${oResult.rows[0].count}`);
  console.log(oResult.rows[0].count); */

    runQuery(db, addProduct, 1000);
    setTimeout(runQuery, 10000, db, getCountryProducts, 10000); 
    setTimeout(runQuery, 120, db, getProductsWithHierarchyCode, 10000);
    setTimeout(runQuery, 1400, db, getUnclassifiedProducts, 10000);
    setTimeout(runQuery, 1600, db, getProductsWithThumbnails, 10000);
    setTimeout(runQuery, 1800, db, updateProductsStatuses, 10000);
    setTimeout(runQuery, 2000, db, updateProductName, 10000);
    setTimeout(runQuery, 2000, db, deleteRandomProduct, 100000);
}

async function runQuery (db, fRunFunction, iDelay){
  while(true){    
    const oDataToWrite = await fRunFunction(db);
    writeToFile('../postgresNonRelationalQueryResults.csv', oDataToWrite);
    //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
    await delay(iDelay)
  }
} 

 async function delay(iMilliSeconds) {
    return new Promise(resolve => setTimeout(resolve, iMilliSeconds));
}

async function writeToFile(sFilePath, oData){
  fs.stat(sFilePath, function(err) {
    if(!err){
      //if file exists, append data
          const csv = json2Csv(oData, {header: false}) + '\r\n';
          fs.appendFile(sFilePath, csv, function (err){
            if(err){
              console.log(err);
            }
          });
        } else {
          //create file and add headers
          const csv = json2Csv(oData, {header: true}) + '\r\n';
          fs.writeFile(sFilePath, csv, function (err) {
            if(err) {
              console.log(err);
            }
          });
        }
  });
}

module.exports = {
  executeQueries
}