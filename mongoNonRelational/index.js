const {addRetailers,addProducts, getCountryProducts,
    getProductsWithHierarchyCode, getUnclassifiedProducts,
    getProductsWithNoThumbnails, deleteRetailersWithNoProducts,
    deleteRandomProduct} = require('./queries');

async function executeQueries (db, oModels){
    //await addProducts(db,oModels)
    //await getCountryProducts(db, oModels);
    //getProductsWithHierarchyCode(oModels);
    //getUnclassifiedProducts(oModels);
    //getProductsWithNoThumbnails(oModels);
    //deleteRetailersWithNoProducts(oModels);
    deleteRandomProduct(oModels);
}

module.exports = {
    executeQueries
}