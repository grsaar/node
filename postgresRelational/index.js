const {addRetailer,addProduct, getCountryProducts,
      getProductsWithHierarchyCode, getUnclassifiedProducts,
      getProductsWithThumbnails, getProductCount,
      getRetailerCount, updateProductsStatuses, updateProductName,
      deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const {writeToFile, delay} = require('../utils');

async function executeQueries (db, sStartTime){
  const sQueryResultsFileName = '../postgresRelationalQueryResults_vol2.csv';
  const sContainerStatsFileName = '../postgresRelationalContainerStats_vol2.csv';
  
    runQuery(db, addRetailer, 100, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 200, db, addProduct, 100, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2000, db, getCountryProducts, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2400, db, getProductsWithHierarchyCode, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2800, db, getUnclassifiedProducts, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 3200, db, getProductsWithThumbnails, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 3600, db, updateProductsStatuses, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 4000, db, updateProductName, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 400, db, deleteRandomProduct, 2000, sQueryResultsFileName, sStartTime);  

    setTimeout(runQuery, 400, db, getProductCount, 1000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 400, db, getRetailerCount, 1000, sQueryResultsFileName, sStartTime);
    
    setTimeout(runQuery, 400, '*', si.dockerContainerStats, 400, sContainerStatsFileName, sStartTime);
  }

async function runQuery (db, fRunFunction, iDelay, sFileName, sStartTime){
  while(Date.now() < sStartTime + 7020000){
    const oDataToWrite = await fRunFunction(db);
    writeToFile(sFileName, oDataToWrite);
    //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
    await delay(iDelay);
  }
} 

module.exports = {
    executeQueries
}