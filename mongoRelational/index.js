const {addRetailer,addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
    const si = require('systeminformation');

async function executeQueries (db, oModels){
    runQuery(oModels, addRetailer, 1000);
    setTimeout(runQuery, 1000, oModels, addProduct, 1000);
    setTimeout(runQuery, 10000, oModels, getCountryProducts, 10000);
    setTimeout(runQuery, 12000, oModels, getProductsWithHierarchyCode, 10000);
    setTimeout(runQuery, 14000, oModels, getUnclassifiedProducts, 10000);
    setTimeout(runQuery, 16000, oModels, getProductsWithThumbnails, 10000);
    setTimeout(runQuery, 18000, oModels, updateProductsStatuses, 10000);
    setTimeout(runQuery, 20000, oModels, updateProductName, 10000);
    setTimeout(runQuery, 20000, oModels, deleteRandomProduct, 100000);
}

async function runQuery (oModels, fRunFunction, iDelay){
    while(true){
      fRunFunction(oModels);
      //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
      await delay(iDelay)
    }
  } 
  
   async function delay(iMilliSeconds) {
      return new Promise(resolve => setTimeout(resolve, iMilliSeconds));
  }

module.exports = {
    executeQueries
}