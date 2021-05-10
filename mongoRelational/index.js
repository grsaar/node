const {addRetailer,addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount,
    getRetailerCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const {writeToFile, delay} = require('../utils');

async function executeQueries (db, oModels){
  const sQueryResultsFileName = '../mongoRelationalQueryResults.csv';
  const sContainerStatsFileName = '../mongoRelationalContainerStats.csv';

    runQuery(oModels, addRetailer, 1000, sQueryResultsFileName);
    setTimeout(runQuery, 1000, oModels, addProduct, 1000, sQueryResultsFileName);
    setTimeout(runQuery, 10000, oModels, getCountryProducts, 10000, sQueryResultsFileName);
    setTimeout(runQuery, 12000, oModels, getProductsWithHierarchyCode, 10000, sQueryResultsFileName);
    setTimeout(runQuery, 14000, oModels, getUnclassifiedProducts, 10000, sQueryResultsFileName);
    setTimeout(runQuery, 16000, oModels, getProductsWithThumbnails, 10000, sQueryResultsFileName);
    setTimeout(runQuery, 18000, oModels, updateProductsStatuses, 10000, sQueryResultsFileName);
    setTimeout(runQuery, 20000, oModels, updateProductName, 10000, sQueryResultsFileName);
    setTimeout(runQuery, 2000, oModels, deleteRandomProduct, 100000, sQueryResultsFileName);  

    setTimeout(runQuery, 200, oModels, getProductCount, 10000, sQueryResultsFileName);
    setTimeout(runQuery, 2000, oModels, getRetailerCount, 10000, sQueryResultsFileName);
    
    setTimeout(runQuery, 200, '*', si.dockerContainerStats, 10000, sContainerStatsFileName); 
}

async function runQuery (oModels, fRunFunction, iDelay, sFileName){
    while(true){
      const oDataToWrite = await fRunFunction(oModels);
      writeToFile(sFileName, oDataToWrite);
      //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
      await delay(iDelay)
    }
  } 

module.exports = {
    executeQueries
}