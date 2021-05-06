const {addRetailers,addProducts, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, updateProductsStatuses, updateProductName, deleteRetailersWithNoProducts,
    deleteRandomProduct} = require('./queries');
    const si = require('systeminformation');

async function executeQueries (db, oModels){
  exec(db, oModels);
    
    //await addProducts(db,oModels)
    //await getCountryProducts(db, oModels);
    //getProductsWithHierarchyCode(db, oModels);
    //getUnclassifiedProducts(db);
    //getProductsWithThumbnails(db);
    //updateProductsStatuses(db, oModels);
    //updateProductName(db, oModels);
    //deleteRandomProduct(db, oModels);
}

async function exec (db, oModels){
    while(true){
      //updateProductsStatuses(db, oModels)
      //updateProductName(db);
      addProducts(db, oModels);
      //getCountryProducts(db, oModels);
      //deleteRandomProduct(db);
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