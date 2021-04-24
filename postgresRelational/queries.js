const {getRandomString, getRandomInteger} = require('../utils');

function getCounrtyProducts(db){
    const iCountryId = getRandomInteger(1,198);
    const oResult =  await db.query(`SELECT "Country"."Id" AS "CountryId", "Retailer"."Id" AS "RetailerId", "Product".* FROM "Country" 
    LEFT JOIN "Retailer" ON "Country"."Id" = "Retailer"."CounrtyId"
    LEFT JOIN "Product" ON "Product"."RetailerId" = "Retailer"."Id"
    WHERE "Country"."Id" = ${iCountryId}
    AND "Product"."RetailerId" = "Retailer"."Id"`).catch(console.log);
}

SELECT * FROM "Country" 
    LEFT JOIN "Retailer" ON "Country"."Id" = "Retailer"."CounrtyId"
    LEFT JOIN "Product" ON "Product"."RetailerId" = "Retailer"."Id"
    WHERE "Country"."Id" = 19
    AND "Product"."RetailerId" = "Retailer"."Id";

    select "Country"."Id" as "CountryId", "Retailer"."Id" as "RetailerId", "Product"."Id", "Product"."RetailerId" from "Country" left join "Retailer" on "Country"."Id" = "Retailer"."Coun
    tryId" left join "Product" on "Product"."RetailerId" = "Retailer"."Id" where "Country"."Id" = 19 and "Product"."RetailerId" = "Retailer"."Id";