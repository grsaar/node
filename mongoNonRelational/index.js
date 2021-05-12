const {addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const {writeToFile, delay} = require('../utils');

async function executeQueries (db, oModels, sStartTime){
  const sQueryResultsFileName = '../mongoNonRelationalQueryResults.csv';
  const sContainerStatsFileName = '../mongoNonRelationalContainerStats.csv';
  
  runQuery(db, oModels, addProduct, 500, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 10000, db, oModels, getCountryProducts, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 12000, db, oModels, getProductsWithHierarchyCode, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 14000, db, oModels, getUnclassifiedProducts, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 16000, db, oModels, getProductsWithThumbnails, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 18000, db, oModels, updateProductsStatuses, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 20000, db, oModels, updateProductName, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2000, db, oModels, deleteRandomProduct, 10000, sQueryResultsFileName, sStartTime);  

    setTimeout(runQuery, 2000, db, oModels, getProductCount, 5000, sQueryResultsFileName, sStartTime);
    
    setTimeout(runQuery, 2000, '*', null, si.dockerContainerStats, 5000, sContainerStatsFileName, sStartTime);
}

async function runQuery (db, oModels, fRunFunction, iDelay, sFileName, sStartTime){
    while(Date.now() < sStartTime + 7020000){
      const oDataToWrite = await fRunFunction(db, oModels);
      writeToFile(sFileName, oDataToWrite);
      //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
      await delay(iDelay)
    }
  } 

module.exports = {
    executeQueries
}