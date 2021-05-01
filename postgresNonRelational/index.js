const {addProducts, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithNoThumbnails, deleteRetailersWithNoProducts,
    deleteRandomProduct} = require('./queries');



async function executeQueries (db){
    //addProducts(db)
  //getCountryProducts(db);
  //getProductsWithHierarchyCode(db);
  //getUnclassifiedProducts(db);
  //getProductsWithNoThumbnails(db);
  //deleteRetailersWithNoProducts(db);
  deleteRandomProduct(db);
}

module.exports = {
  executeQueries
}