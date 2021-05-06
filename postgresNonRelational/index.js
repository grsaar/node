const {addProducts, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, updateProductsStatuses, updateProductName, deleteRetailersWithNoProducts,
    deleteRandomProduct} = require('./queries');
    const si = require('systeminformation');



async function executeQueries (db){
  exec(db);
    //addProducts(db)
  //getCountryProducts(db);
  //getProductsWithHierarchyCode(db);
  //getUnclassifiedProducts(db);
  //getProductsWithThumbnails(db);
  //deleteRetailersWithNoProducts(db);
  //deleteRandomProduct(db);
}

async function exec (db){
  while(true){    
    //updateProductsStatuses(db);
    //updateProductName(db);
    addProducts(db);
    //getProductsWithHierarchyCode(db);
   // si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
    await delay(1000)
  }
} 

 async function delay(iMillis) {
    return new Promise(resolve => setTimeout(resolve, iMillis));
}

module.exports = {
  executeQueries
}