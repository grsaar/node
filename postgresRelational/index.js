const {addRetailers,addProducts, getCountryProducts,
      getProductsWithHierarchyCode, getUnclassifiedProducts,
      getProductsWithThumbnails, updateProductsStatuses, updateProductName,
      deleteRandomProduct} = require('./queries');
      const si = require('systeminformation');



async function executeQueries (db){
    // addRetailers(db)
    exec(db);
  
    //getCountryProducts(db);
    //getProductsWithHierarchyCode(db);
    //getUnclassifiedProducts(db);
    //getProductsWithThumbnails(db);
    //updateProductsStatuses(db);
    //updateProductName(db);
    //deleteRandomProduct(db);
  }

async function exec (db){
  while(true){
    //updateProductsStatuses(db)
    //updateProductName(db);
    addProducts(db);
    //si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
    await delay(1000)
  }
} 

 async function delay(iMillis) {
    return new Promise(resolve => setTimeout(resolve, iMillis));
}

module.exports = {
    executeQueries
}