const http = require('http');
const hostName = '127.0.0.1';
const mongoose = require('mongoose');
const { response } = require('express');
const Schema = mongoose.Schema;
const {importDataToMongoFromCsv} = require('./import/importData');
const {updateHierarchyCodesMongo} = require('./import/classificationItemHierarchyCode');
//const {executeQueries} = require('./mongoRelational/index');
const {executeQueries} = require('./mongoNonRelational/index');
const defineModels = require('./mongoRelational/models');

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
  //console.log(db);
  const oModels = defineModels(db);
  //await importDataToMongoFromCsv(oModels);
  //await updateHierarchyCodesMongo(db, oModels)
  await executeQueries(db, oModels)
  .catch(console.log);
})();