//const db = require('./index.js');

module.exports = {
    addCountries: `INSERT INTO "Country"("InternalId","Name") VALUES($1,$2)`,
    addClassifications: `INSERT INTO "Classification"("InternalId","Name") VALUES($1,$2)`,
    addClassificationItems: `INSERT INTO "Classification Item"("InternalId","Name","ClassificationId","ParentId") VALUES($1,$2,$3,$4)`,
    addTypes: `INSERT INTO "Type"("InternalId","Name") VALUES($1,$2)`,
    addStatus: `INSERT INTO "Status"("InternalId","Name") VALUES($1,$2)`    
    }