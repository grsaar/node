const http = require('http');
const hostName = '127.0.0.1';
const fs = require('fs');
const fastcsv = require('fast-csv');
const { Client } = require('pg');
const connectionString = 'postgresql://postgres:parool2@127.0.0.1:8080';
const {importDataToPostgresFromCsv} = require('./import/importData');
const {updateHierarchyCodesPg} = require('./import/classificationItemHierarchyCode');
//const {executeQueries} = require('./postgresRelational/index');
const {executeQueries} = require('./postgresNonRelational/index');

async function connectDatabase() {
  return new Promise ((resolve, reject) => {
    const client = new Client({
      connectionString: connectionString
    });  
    client.connect().catch(reject);
    client.on('connect', () => {
      console.log('Connected!');
      resolve(client);
      
    });
  })
}

(async function () {
  const db = await connectDatabase();
  //await importDataToPostgresFromCsv(db)
  //await updateHierarchyCodesPg(db)
  await executeQueries(db)
  .catch(console.log);
})();
