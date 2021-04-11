//const db = require('./index.js');

module.exports = {
    addCountries: `INSERT INTO "Country"("Name") VALUES($1)`,
    addClassifications: `INSERT INTO "Classification"("Name") VALUES($1)`,
    addClassificationItems: `INSERT INTO "Classification Item"("Id","ParentId","Name","ClassificationId") VALUES($1,$2,$3,$4)`,
    addTypes: `INSERT INTO "Type"("Name") VALUES($1)`,
    addStatus: `INSERT INTO "Status"("Name") VALUES($1)`
    }