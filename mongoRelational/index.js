const {addRetailer,addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount,
    getRetailerCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const {writeToFile, delay} = require('../utils');

async function executeQueries (db, oModels, sStartTime){
  const sQueryResultsFileName = '../mongoRelationalQueryResults_vol3.csv';
  const sContainerStatsFileName = '../mongoRelationalContainerStats_vol3.csv';

    runQuery(oModels, addProduct, 100, sQueryResultsFileName, sStartTime);
    //setTimeout(runQuery, 200, oModels, addProduct, 100, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2000, oModels, getCountryProducts, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2400, oModels, getProductsWithHierarchyCode, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2800, oModels, getUnclassifiedProducts, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 3200, oModels, getProductsWithThumbnails, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 3600, oModels, updateProductsStatuses, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 4000, oModels, updateProductName, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 400, oModels, deleteRandomProduct, 2000, sQueryResultsFileName, sStartTime);  

    setTimeout(runQuery, 400, oModels, getProductCount, 1000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 400, oModels, getRetailerCount, 1000, sQueryResultsFileName, sStartTime);
    
    setTimeout(runQuery, 400, '*', si.dockerContainerStats, 400, sContainerStatsFileName, sStartTime); 
}

async function runQuery (oModels, fRunFunction, iDelay, sFileName, sStartTime){
    while(Date.now() < sStartTime + 7200000){
      fRunFunction(oModels).then(oDataToWrite => {
        writeToFile(sFileName, oDataToWrite);
      });
      //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
      await delay(iDelay)
    }
  } 

module.exports = {
    executeQueries
}