const {addProduct, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
    const si = require('systeminformation');



async function executeQueries (db){
    runQuery(db, addProduct, 1000);
    setTimeout(runQuery, 10000, db, getCountryProducts, 10000); 
    setTimeout(runQuery, 120, db, getProductsWithHierarchyCode, 10000);
    setTimeout(runQuery, 1400, db, getUnclassifiedProducts, 10000);
    setTimeout(runQuery, 1600, db, getProductsWithThumbnails, 10000);
    setTimeout(runQuery, 1800, db, updateProductsStatuses, 10000);
    setTimeout(runQuery, 2000, db, updateProductName, 10000);
    setTimeout(runQuery, 2000, db, deleteRandomProduct, 100000);
}

async function runQuery (db, fRunFunction, iDelay){
  while(true){    
    fRunFunction(db);
   // si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
    await delay(iDelay)
  }
} 

 async function delay(iMilliSeconds) {
    return new Promise(resolve => setTimeout(resolve, iMilliSeconds));
}

module.exports = {
  executeQueries
}