const {addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const fs = require('fs');
const json2Csv = require('json2csv').parse;

async function executeQueries (db, oModels){
  /*  const oResult = await getProductCount(oModels);
  //await writeToFile('../queryExecResult.txt', `Product count ${oResult.rows[0].count}`);
  console.log(oResult); */
    runQuery(db, oModels, addProduct, 1000);
    setTimeout(runQuery, 1000, db, oModels, getCountryProducts, 10000); 
    setTimeout(runQuery, 1200, db, oModels, getProductsWithHierarchyCode, 10000);
    setTimeout(runQuery, 1400, db, oModels, getUnclassifiedProducts, 10000);
    setTimeout(runQuery, 1600, db, oModels, getProductsWithThumbnails, 10000);
    setTimeout(runQuery, 1800, db, oModels, updateProductsStatuses, 10000);
    setTimeout(runQuery, 2000, db, oModels, updateProductName, 10000);
    setTimeout(runQuery, 2000, db, oModels, deleteRandomProduct, 100000); 
}

async function runQuery (db, oModels, fRunFunction, iDelay){
    while(true){
      const oDataToWrite = await fRunFunction(db, oModels);
      writeToFile('../mongoNonRelationalQueryResults.csv', oDataToWrite);
      //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
      await delay(iDelay)
    }
  } 
  
   async function delay(iMillis) {
      return new Promise(resolve => setTimeout(resolve, iMillis));
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