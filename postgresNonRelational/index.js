const {addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const {writeToFile, delay} = require('../utils');

async function executeQueries (db, sStartTime){
  const sQueryResultsFileName = '../postgresNonRelationalQueryResults_vol3.csv';
  const sContainerStatsFileName = '../postgresNonRelationalContainerStats_vol3.csv';
  
    runQuery(db, addProduct, 100, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2000, db, getCountryProducts, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2400, db, getProductsWithHierarchyCode, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2800, db, getUnclassifiedProducts, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 3200, db, getProductsWithThumbnails, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 3600, db, updateProductsStatuses, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 4000, db, updateProductName, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 400, db, deleteRandomProduct, 2000, sQueryResultsFileName, sStartTime);  

    setTimeout(runQuery, 400, db, getProductCount, 1000, sQueryResultsFileName, sStartTime);
    
    setTimeout(runQuery, 400, '*', si.dockerContainerStats, 400, sContainerStatsFileName, sStartTime);
}

async function runQuery (db, fRunFunction, iDelay, sFileName, sStartTime){
  while(Date.now() < sStartTime + 7200000){    
    fRunFunction(db).then(oDataToWrite => {
      writeToFile(sFileName, oDataToWrite);
    });
    //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
    await delay(iDelay)
  }
} 

module.exports = {
  executeQueries
}