const {addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, getProductCount, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
const si = require('systeminformation');
const {writeToFile, delay} = require('../utils');

async function executeQueries (db, oModels, sStartTime){
  const sQueryResultsFileName = '../mongoNonRelationalQueryResults_vol3.csv';
  const sContainerStatsFileName = '../mongoNonRelationalContainerStats_vol3.csv';
  
  runQuery(db, oModels, addProduct, 100, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2000, db, oModels, getCountryProducts, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2400, db, oModels, getProductsWithHierarchyCode, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 2800, db, oModels, getUnclassifiedProducts, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 3200, db, oModels, getProductsWithThumbnails, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 3600, db, oModels, updateProductsStatuses, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 4000, db, oModels, updateProductName, 2000, sQueryResultsFileName, sStartTime);
    setTimeout(runQuery, 400, db, oModels, deleteRandomProduct, 2000, sQueryResultsFileName, sStartTime);  

    setTimeout(runQuery, 400, db, oModels, getProductCount, 1000, sQueryResultsFileName, sStartTime);
    
    setTimeout(runQuery, 400, '*', null, si.dockerContainerStats, 400, sContainerStatsFileName, sStartTime);
}

async function runQuery (db, oModels, fRunFunction, iDelay, sFileName, sStartTime){
    while(Date.now() < sStartTime + 7200000){
      fRunFunction(db, oModels).then(oDataToWrite => {
        writeToFile(sFileName, oDataToWrite);
      });
      //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
      await delay(iDelay)
    }
  } 

module.exports = {
    executeQueries
}