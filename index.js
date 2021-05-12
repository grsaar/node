const http = require('http');
const hostName = '127.0.0.1';
const fs = require('fs');
const fastcsv = require('fast-csv');
const si = require('systeminformation');
const { Client } = require('pg');
const connectionString = 'postgresql://postgres:parool@127.0.0.1:8080';
const {importDataToPostgresFromCsv} = require('./import/importData');
const {updateHierarchyCodesPg} = require('./import/classificationItemHierarchyCode');
const {executeQueries} = require('./postgresRelational/index');
//const {executeQueries} = require('./postgresNonRelational/index');
const {closeStreams, delay} = require('./utils');

let client;
async function connectDatabase() {
  return new Promise ((resolve, reject) => {
     client = new Client({
      connectionString: connectionString
    });  
    client.connect().catch(reject);
    client.on('connect', () => {
      console.log('Connected!');      
      resolve(client);      
    });
  });
}

(async function () {
   db = await connectDatabase();
  //await importDataToPostgresFromCsv(db)
  //await updateHierarchyCodesPg(db)
  await executeQueries(db, Date.now())
  .catch(console.log);
  return await delay(7800000);
})().then(() => {
  console.log('Closing connections');
  client.end();
  closeStreams();
});