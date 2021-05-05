const {addRetailers,addProducts, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithThumbnails, updateProductsStatuses, updateProductName, deleteRetailersWithNoProducts,
    deleteRandomProduct} = require('./queries');
    const si = require('systeminformation');

async function executeQueries (oModels){
    exec(oModels);
    // addRetailers(oModels)
  //addProducts(oModels)
    //await getCountryProducts(oModels);
    //getProductsWithHierarchyCode(oModels);
    //getUnclassifiedProducts(oModels);
    //getProductsWithThumbnails(oModels);
    //updateProductsStatuses(oModels);
    //updateProductName(oModels);
    //deleteRetailersWithNoProducts(oModels);
    //deleteRandomProduct(oModels);
}

async function exec (oModels){
    while(true){
      //updateProductsStatuses(oModels)
      updateProductName(oModels)
      //addProducts(db);
      si.dockerContainerStats('*',obj => console.log(JSON.stringify(obj, null, 2)));
      await delay(1000)
    }
  } 
  
   async function delay(iMillis) {
      return new Promise(resolve => setTimeout(resolve, iMillis));
  }

module.exports = {
    executeQueries
}