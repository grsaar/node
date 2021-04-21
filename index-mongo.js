const http = require('http');
const hostName = '127.0.0.1';
const mongoose = require('mongoose');
const { response } = require('express');
const Schema = mongoose.Schema;
const {importDataToMongoFromCsv} = require('./import/importData');
const {updateHierarchyCodesMongo} = require('./import/classificationItemHierarchyCode');
//const {addRetailers, addProducts} = require('./mongoRelational/index');
const {addProducts} = require('./mongoNonRelational/index');
const defineModels = require('./mongoRelational/schemas');

 async function connectDatabase() {
  return new Promise ((resolve, reject) => {
    mongoose.connect('mongodb://127.0.0.1:8080/test', { useNewUrlParser: true })
    .catch(reject);
    const db = mongoose.connection;
    db.once('open',  function () {
        console.log('Connected!');
        resolve(db);
  
    });
  }) 
}

(async function () {
  const db = await connectDatabase();
  //defineModels(db);
 // await importDataToMongoFromCsv(db)
 // await updateHierarchyCodesMongo(db)
  //await addRetailers(db)
  await addProducts(db)
 // .catch(console.log);
})();
/*
db.collection("Status")
            .insertMany(statuses, (err, res) => {
                if (err) throw err;
                console.log(`Inserted: ${res.insertedCount} rows`);
            });
        db.close();
        */