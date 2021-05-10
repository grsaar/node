const {addRetailer,addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount,
    getRetailerCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const fs = require('fs');
const json2Csv = require('json2csv').parse;

async function executeQueries (db, oModels){
 /*  const oResult = await getProductCount(oModels);
  const oRetailerResult = await getRetailerCount(oModels);
  //await writeToFile('../queryExecResult.txt', `Product count ${oResult.rows[0].count}`);
  console.log(oResult);
  console.log(oRetailerResult); */
    // runQuery(oModels, addRetailer, 1000);
    setTimeout(runQuery, 1000, oModels, addProduct, 1000);
    setTimeout(runQuery, 1000, oModels, getCountryProducts, 10000);
    setTimeout(runQuery, 1200, oModels, getProductsWithHierarchyCode, 10000);
    setTimeout(runQuery, 1400, oModels, getUnclassifiedProducts, 10000);
    setTimeout(runQuery, 1600, oModels, getProductsWithThumbnails, 10000);
    setTimeout(runQuery, 1800, oModels, updateProductsStatuses, 10000);
    setTimeout(runQuery, 2000, oModels, updateProductName, 10000);
    setTimeout(runQuery, 2000, oModels, deleteRandomProduct, 100000);  
}

async function runQuery (oModels, fRunFunction, iDelay){
    while(true){
      const oDataToWrite = await fRunFunction(oModels);
      writeToFile('../mongoRelationalQueryResults.csv', oDataToWrite);
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