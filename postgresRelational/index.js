const {addRetailer,addProduct, getCountryProducts,
      getProductsWithHierarchyCode, getUnclassifiedProducts,
      getProductsWithThumbnails, updateProductsStatuses, updateProductName,
      deleteRandomProduct} = require('./queries');
      const si = require('systeminformation');



async function executeQueries (db){
    runQuery(db, addRetailer, 1000);
    setTimeout(runQuery, 1000, db, addProduct, 1000);
    setTimeout(runQuery, 10000, db, getCountryProducts, 10000);
    setTimeout(runQuery, 12000, db, getProductsWithHierarchyCode, 10000);
    setTimeout(runQuery, 14000, db, getUnclassifiedProducts, 10000);
    setTimeout(runQuery, 16000, db, getProductsWithThumbnails, 10000);
    setTimeout(runQuery, 18000, db, updateProductsStatuses, 10000);
    setTimeout(runQuery, 20000, db, updateProductName, 10000);
    setTimeout(runQuery, 20000, db, deleteRandomProduct, 100000);
  }

async function runQuery (db, fRunFunction, iDelay){
  while(true){
    fRunFunction(db);
    //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
    await delay(iDelay);
  }
} 

 async function delay(iMilliSeconds) {
    return new Promise(resolve => setTimeout(resolve, iMilliSeconds));
}

module.exports = {
    executeQueries
}