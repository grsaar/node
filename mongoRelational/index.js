const {addRetailers,addProducts, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, updateProductsStatuses, updateProductName,
    deleteRandomProduct} = require('./queries');
    const si = require('systeminformation');

async function executeQueries (db, oModels){
    exec(db, oModels);
    // 
  //addProducts(oModels)
    //await getCountryProducts(oModels);
    //getProductsWithHierarchyCode(oModels);
    //getUnclassifiedProducts(oModels);
    //getProductsWithThumbnails(oModels);
    //updateProductsStatuses(oModels);
    //updateProductName(oModels);
    //deleteRandomProduct(oModels);
}

async function exec (db, oModels){
    while(true){
      //updateProductsStatuses(oModels)
      //addRetailers(oModels);
      //updateProductName(oModels)
      //addProducts(oModels);
      //getCountryProducts(oModels);
      //getProductsWithHierarchyCode(oModels);
      //getUnclassifiedProducts(oModels);
      deleteRandomProduct(oModels);
      //getProductsWithThumbnails(oModels);
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