const insertData = require('./insertData');
const fs = require('fs');
const fastcsv = require('fast-csv');

async function readCsv(filename) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filename);
    const results = [];
    const csvStream = fastcsv.parse({ headers: true })
      .on('data', function (data) {
        results.push(data);
      })
      .on('end', function () {
        //console.log(results);
        resolve(results);
      })
    readStream.pipe(csvStream);
  })
}
//COUNTRIES
/*const streamCountry = fs.createReadStream('import/countries.csv');
const countries = [];
const csvStreamCountry = fastcsv.parse({ headers: true })
  .on('data', function (data) {
    countries.push({
      _id: +data.id,
      name: data.name
    });
  })
  .on('end', function () {
    console.log(countries);
  });

streamCountry.pipe(csvStreamCountry);

//CLASSIFICATIONS
const streamClassification = fs.createReadStream('import/classifications.csv');
const classifications = [];
const csvStreamClassifcations = fastcsv.parse({ headers: true })
  .on('data', function (data) {
    classifications.push({
      _id: +data.id,
      name: data.name
    });
  })
  .on('end', function () {
    console.log(classifications);
  });

streamClassifcation.pipe(csvStreamClassification);
*/

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
const statuses = [];
const csvStream = fastcsv.parse({ headers: true })
    .on('data', function (data) {
        statuses.push({
            _id: +data.id,
            name: data.name
        });
    })
    .on('end', function () {
       // console.log(statuses);
    });*/

async function importDataToMongoFromCsv(db) {
  const aCountries = await readCsv('import/countries.csv')
  const aMappedCountries = aCountries.map(oCountry => ({
    internalId: +oCountry.id,
    name: oCountry.name
  }));

  await db.collection("Country")
    .insertMany(aMappedCountries);

  const aClassifications = await readCsv('import/classifications.csv')
  const aMappedClassifications = aClassifications.map(oClassification => ({
    internalId: +oClassification.id,
    name: oClassification.name
  }));

  await db.collection("Classification")
    .insertMany(aMappedClassifications);

  const aClassificationItems = await readCsv('import/classificationItems.csv')
  const aMappedClassificationItems = aClassificationItems.map(oClassificationItem => ({
    internalId: +oClassificationItem.id,
    name: oClassificationItem.name,
    hierarchyCode: null,
    classificationId: +oClassificationItem.classificationId,
    parentId: oClassificationItem.parentId ? +oClassificationItem.parentId : null
  }));

  await db.collection("ClassificationItem")
    .insertMany(aMappedClassificationItems);

  const aTypes = await readCsv('import/types.csv')
  const aMappedTypes = aTypes.map(oType => ({
    internalId: +oType.id,
    name: oType.name
  }));

  await db.collection("Type")
    .insertMany(aMappedTypes);

  const aStatuses = await readCsv('import/status.csv')
  const aMappedStatuses = aStatuses.map(oStatus => ({
    internalId: +oStatus.id,
    name: oStatus.name
  }));

  await db.collection("Status")
    .insertMany(aMappedStatuses);

}

async function importDataToPostgresFromCsv(db) {
  const aCountries = await readCsv('import/countries.csv')
  const aMappedCountries = aCountries.map(oCountry => ([
    +oCountry.id,
    oCountry.name
  ]));

  await aMappedCountries.forEach(row => {
    db.query(insertData.addStatus, row)
    .catch(console.log);
  });

  const aClassifications = await readCsv('import/classifications.csv')
  const aMappedClassifications = aClassifications.map(oClassification => ([
    +oClassification.id,
    oClassification.name
  ]));

  await aMappedClassifications.forEach(row => {
    db.query(insertData.addClassifications, row)
    .catch(console.log);
  });

  const aClassificationItems = await readCsv('import/classificationItems.csv')
  const aMappedClassificationItems = aClassificationItems.map(oClassificationItem => ([
   +oClassificationItem.id,
    oClassificationItem.name,
  +oClassificationItem.classificationId,
    oClassificationItem.parentId ? +oClassificationItem.parentId : null
  ]));

  await aMappedClassificationItems.forEach(row => {
    db.query(insertData.addClassificationItems, row)
    .catch(console.log);
  });

  const aTypes = await readCsv('import/types.csv')
  const aMappedTypes = aTypes.map(oType => ([
    +oType.id,
    oType.name
  ]));

  await aMappedTypes.forEach(row => {
    db.query(insertData.addTypes, row)
    .catch(console.log);
  });

  const aStatuses = await readCsv('import/status.csv')
  const aMappedStatuses = aStatuses.map(oStatus => ([
    +oStatus.id,
    oStatus.name
  ]));

  await aMappedStatuses.forEach(row => {
    db.query(insertData.addStatus, row)
    .catch(console.log);
  });

}

module.exports = {
  importDataToMongoFromCsv,
  importDataToPostgresFromCsv
}

/*
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
      */