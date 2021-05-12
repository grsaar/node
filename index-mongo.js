const http = require('http');
const hostName = '127.0.0.1';
const mongoose = require('mongoose');
const { response } = require('express');
const Schema = mongoose.Schema;
const {importDataToMongoFromCsv} = require('./import/importData');
const {updateHierarchyCodesMongo} = require('./import/classificationItemHierarchyCode');
const {executeQueries} = require('./mongoRelational/index');
//const {executeQueries} = require('./mongoNonRelational/index');
const defineModels = require('./mongoRelational/models');
const {closeStreams, delay} = require('./utils');

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
  const oModels = defineModels(db);
  //await importDataToMongoFromCsv(oModels);
  //await updateHierarchyCodesMongo(db, oModels)
  await executeQueries(db, oModels, Date.now())
  .catch(console.log);
  return await delay(7200000);
})().then(() => {
  console.log('Closing connections');
  mongoose.connection.close();
  closeStreams();
});