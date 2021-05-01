const {addRetailers,addProducts, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithNoThumbnails, deleteRetailersWithNoProducts,
    deleteRandomProduct} = require('./queries');

async function executeQueries (oModels){
    // addRetailers(oModels)
  //addProducts(oModels)
    //await getCountryProducts(oModels);
    //getProductsWithHierarchyCode(oModels);
    //getUnclassifiedProducts(oModels);
    //getProductsWithNoThumbnails(oModels);
    //deleteRetailersWithNoProducts(oModels);
    deleteRandomProduct(oModels);
}

module.exports = {
    executeQueries
}