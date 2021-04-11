const http = require('http');
const hostName = '127.0.0.1';
const mongoose = require('mongoose');
const insertData = require('./insertData');
const fs = require('fs');
const fastcsv = require('fast-csv');
const Schema = mongoose.Schema;

//COUNTRIES
/*const stream = fs.createReadStream('import/countries.csv');
const countries = [];
const csvStream = fastcsv.parse({ headers: true })
.on('data', function(data){
  countries.push({
    _id: +data.id,
    name: data.name
  });
})
.on('end', function(){
  console.log(countries);
});*/

//CLASSIFICATIONS
/*const stream = fs.createReadStream('import/classifications.csv');
const classifications = [];
const csvStream = fastcsv.parse({ headers: true })
.on('data', function(data){
  classifications.push({
    _id: +data.id,
    name: data.name
  });
})
.on('end', function(){
  console.log(classifications);
}); */

//CLASSIFICATION ITEMS
/*const stream1 = fs.createReadStream('import/classificationItems.csv');
const classificationItems = [];
const csvStream1 = fastcsv.parse({ headers: true })
.on('data', function(data){
    classificationItems.push({
    _id: +data.id,
    parentId: data.parentId ? +data.parentId : null,
    name: data.name,
    classificationId: +data.classificationId
  });
})
.on('end', function(){
  console.log(classificationItems);
}); */

//TYPES
/*const stream = fs.createReadStream('import/types.csv');
const types = [];
const csvStream = fastcsv.parse({ headers: true })
.on('data', function(data){
  types.push({
    _id: +data.id,
    name: data.name
  });
})
.on('end', function(){
  console.log(types);
});*/ 

//STATUS
/*const stream = fs.createReadStream('import/status.csv');
const status = [];
const csvStream = fastcsv.parse({ headers: true })
.on('data', function(data){
  status.push({
      _id: +data.id,
      name: data.name
  });
})
.on('end', function(){
  console.log(status);
}); */

function connectDatabase() {
    mongoose.connect('mongodb://127.0.0.1:8080/test', { useNewUrlParser: true})
    .catch(err => {
        console.log(err)
    });
    const db = mongoose.connection;
    db.once('open', function() {
        console.log('Connected!');
        /*db.collection("Type")
          .insertMany(types, (err, res) => {
            if (err) throw err;
            console.log(`Inserted: ${res.insertedCount} rows`);
            db.close();
          });*/
    });
}

stream.pipe(csvStream);

module.exports = connectDatabase();
