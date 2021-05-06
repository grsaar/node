const {addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
    const si = require('systeminformation');

async function executeQueries (db, oModels){
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
      fRunFunction(db, oModels);
      //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
      await delay(iDelay)
    }
  } 
  
   async function delay(iMillis) {
      return new Promise(resolve => setTimeout(resolve, iMillis));
  }


module.exports = {
    executeQueries
}