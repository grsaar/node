const {addRetailer,addProduct, getCountryProducts,
      getProductsWithHierarchyCode, getUnclassifiedProducts,
      getProductsWithThumbnails, getProductCount,
      getRetailerCount, updateProductsStatuses, updateProductName,
      deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const fs = require('fs');
const json2Csv = require('json2csv').parse;

async function executeQueries (db){
  /* const oResult = await getProductCount(db);
  const oRetailerResult = await getRetailerCount(db);
  await writeToFile('../queryExecResult.txt', `Product count ${oResult.rows[0].count}`);
  console.log(oResult.rows[0].count);
  console.log(oRetailerResult.rows[0].count); */
    runQuery(db, addRetailer, 1000);
    setTimeout(runQuery, 1000, db, addProduct, 1000);
    setTimeout(runQuery, 10000, db, getCountryProducts, 10000);
    setTimeout(runQuery, 12000, db, getProductsWithHierarchyCode, 10000);
    setTimeout(runQuery, 14000, db, getUnclassifiedProducts, 10000);
    setTimeout(runQuery, 16000, db, getProductsWithThumbnails, 10000);
    setTimeout(runQuery, 18000, db, updateProductsStatuses, 10000);
    setTimeout(runQuery, 20000, db, updateProductName, 10000);
    setTimeout(runQuery, 2000, db, deleteRandomProduct, 100000); 
  }

async function runQuery (db, fRunFunction, iDelay){
  while(true){
    const oDataToWrite = await fRunFunction(db);
    writeToFile('../postgresRelationalQueryResults.csv', oDataToWrite);
    //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
    await delay(iDelay);
  }
} 

async function delay(iMilliSeconds) {
  return new Promise(resolve => setTimeout(resolve, iMilliSeconds));
}

async function writeToFile(sFilePath, oData){
  fs.stat(sFilePath, function(err) {
    if(!err){
      //if file exists, append data
      let csv;
      console.log(oData);
      if(Array.isArray(oData)){
        oData.forEach(function(oDataToWrite){
          if(!csv){
            csv = json2Csv(oDataToWrite, {header: false}) + '\r\n';
          } else {
            csv += json2Csv(oDataToWrite, {header: false}) + '\r\n';
          }
        });
      } else {
         csv = json2Csv(oData, {header: false}) + '\r\n';
      }
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