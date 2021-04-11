const http = require('http');
const hostName = '127.0.0.1';
//const mongoose = require('mongoose');
const insertData = require('./insertData');
const fs = require('fs');
const fastcsv = require('fast-csv');
const { Client } = require('pg');
const connectionString = 'postgresql://postgres:parool@127.0.0.1:8080';

//COUNTRIES
/*const stream = fs.createReadStream('import/countries.csv');
const countries = [];
const csvStream = fastcsv.parse({ headers: true })
.on('data', function(data){
  countries.push([
    +data.id,
    data.name
  ]);
})
.on('end', function(){
  console.log(countries);
}); */

//CLASSIFICATIONS
/*const stream = fs.createReadStream('import/classifications.csv');
const classifications = [];
const csvStream = fastcsv.parse({ headers: true })
.on('data', function(data){
  classifications.push([
    +data.id,
    data.name
  ]);
})
.on('end', function(){
  console.log(classifications);
}); */

//CLASSIFICATION ITEMS
/*const stream = fs.createReadStream('import/classificationItems.csv');
const classificationItems = [];
const csvStream = fastcsv.parse({ headers: true })
.on('data', function(data){
  classificationItems.push([
    +data.id,
    data.parentId ? +data.parentId : null,
    data.name,
    +data.classificationId
  ]);
})
.on('end', function(){
  console.log(classificationItems);
});*/ 

//TYPES
/*const stream = fs.createReadStream('import/types.csv');
const types = [];
const csvStream = fastcsv.parse({ headers: true })
.on('data', function(data){
  types.push([
    +data.id,
    data.name
  ]);
})
.on('end', function(){
  console.log(types);
});*/ 

//STATUS
/*const stream = fs.createReadStream('import/status.csv');
const status = [];
const csvStream = fastcsv.parse({ headers: true })
.on('data', function(data){
  status.push([
    +data.id,
    data.name
  ]);
})
.on('end', function(){
  console.log(types);
});*/

function connectDatabase() {
  const client = new Client({
    connectionString: connectionString
  });

  client.connect().catch(err => console.log(err));
  client.on('connect', () => {
    console.log('Connected!');
    console.log(status);
    const statusQuery = insertData.addStatus;
    try {
      status.forEach(row => {
        client.query(statusQuery, row, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("inserted " + res.rowCount + " row:", row);
          }
        });
      });
    } finally {
      console.log(`Done!`);
    } 
  });
}

stream.pipe(csvStream);

module.exports = connectDatabase();
/*mongoose.connect('mongodb://127.0.0.1:8080/test', { useNewUrlParser: true})
.catch(err => {
  console.log(err)
});
const db = mongoose.connection;
db.once('open', function() {
  console.log('Connected!');
});*/
