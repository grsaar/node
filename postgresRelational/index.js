const {addRetailers,addProducts, getCountryProducts,
      getProductsWithHierarchyCode, getUnclassifiedProducts,
      getProductsWithNoThumbnails, deleteRetailersWithNoProducts,
      deleteRandomProduct} = require('./queries');



async function executeQueries (db){
    // addRetailers(db)
    exec(db);
  
    //getCountryProducts(db);
    //getProductsWithHierarchyCode(db);
    //getUnclassifiedProducts(db);
    //getProductsWithNoThumbnails(db);
    //deleteRetailersWithNoProducts(db);
    //deleteRandomProduct(db);
  }

async function exec (db){
  while(true){
    addProducts(db);
    await delay(10)
  }
} 

 async function delay(iMillis) {
    return new Promise(resolve => setTimeout(resolve, iMillis));
}

module.exports = {
    executeQueries
}