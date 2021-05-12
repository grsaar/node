const {addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const {writeToFile, delay} = require('../utils');

async function executeQueries (db, sStartTime){
  const sQueryResultsFileName = '../postgresNonRelationalQueryResults.csv';
  const sContainerStatsFileName = '../postgresNonRelationalContainerStats.csv';
  
    runQuery(db, addProduct, 500, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 10000, db, getCountryProducts, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 12000, db, getProductsWithHierarchyCode, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 14000, db, getUnclassifiedProducts, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 16000, db, getProductsWithThumbnails, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 18000, db, updateProductsStatuses, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 20000, db, updateProductName, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2000, db, deleteRandomProduct, 10000, sQueryResultsFileName, sStartTime);  

    setTimeout(runQuery, 2000, db, getProductCount, 5000, sQueryResultsFileName, sStartTime);
    
    setTimeout(runQuery, 2000, '*', si.dockerContainerStats, 2000, sContainerStatsFileName, sStartTime);
}

async function runQuery (db, fRunFunction, iDelay, sFileName, sStartTime){
  while(Date.now() < sStartTime + 7020000){    
    const oDataToWrite = await fRunFunction(db);
    writeToFile(sFileName, oDataToWrite);
    //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
    await delay(iDelay)
  }
} 

module.exports = {
  executeQueries
}