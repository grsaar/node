const {addRetailer,addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount,
    getRetailerCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const {writeToFile, delay} = require('../utils');

async function executeQueries (db, oModels, sStartTime){
  const sQueryResultsFileName = '../mongoRelationalQueryResults.csv';
  const sContainerStatsFileName = '../mongoRelationalContainerStats.csv';

    runQuery(oModels, addRetailer, 500, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 1000, oModels, addProduct, 500, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 10000, oModels, getCountryProducts, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 12000, oModels, getProductsWithHierarchyCode, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 14000, oModels, getUnclassifiedProducts, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 16000, oModels, getProductsWithThumbnails, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 18000, oModels, updateProductsStatuses, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 20000, oModels, updateProductName, 10000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2000, oModels, deleteRandomProduct, 10000, sQueryResultsFileName, sStartTime);  

    setTimeout(runQuery, 2000, oModels, getProductCount, 5000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2000, oModels, getRetailerCount, 5000, sQueryResultsFileName, sStartTime);
    
    setTimeout(runQuery, 2000, '*', si.dockerContainerStats, 2000, sContainerStatsFileName, sStartTime); 
}

async function runQuery (oModels, fRunFunction, iDelay, sFileName, sStartTime){
    while(Date.now() < sStartTime + 7020000){
      const oDataToWrite = await fRunFunction(oModels);
      writeToFile(sFileName, oDataToWrite);
      //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
      await delay(iDelay)
    }
  } 

module.exports = {
    executeQueries
}