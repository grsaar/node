const fs = require('fs');
const json2Csv = require('json2csv').parse;

function prepareTree (aItems, sInternalId, sParentId){
    const aTree = [];
    const oFlat = {};

    aItems.forEach(oItem => {
        oItem['children'] = [];
        oFlat[oItem[sInternalId]] = oItem;
    });

    aItems.forEach(oItem => {
        if(oItem[sParentId] && oFlat[oItem[sParentId]]){
            oFlat[oItem[sParentId]]['children'].push(oItem);
        } else {
            aTree.push(oItem);
        }
    });

    return {
        tree: aTree,
        flat: oFlat,
        list: aItems
    };
}

function getRandomString(iLength){
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let sString = '';
    for (let i=0; i< iLength; i++){
        sString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return sString;
}

function getRandomInteger(iMin, iMax){
    return Math.floor(Math.random() * (iMax-iMin) + iMin);
}

async function writeToFile(sFilePath, oData){
    fs.stat(sFilePath, function(error) {
      let csv;
      console.log(oData);
      if(Array.isArray(oData)){
        oData.forEach(function(oDataToWrite){
          if(!csv){
            csv = json2Csv(oDataToWrite, {header: error ? true : false}) + '\r\n';
          } else {
            csv += json2Csv(oDataToWrite, {header: false}) + '\r\n';
          }
        });
      } else {
         csv = json2Csv(oData, {header: error ? true : false}) + '\r\n';
      }
  
      //if file exists, append data     
      if(!error){
          fs.appendFile(sFilePath, csv, function (err){
            if(err){
              console.log(err);
            }
          });
        } else {
          //create file and add headers
          //const csv = json2Csv(oData, {header: true}) + '\r\n';
          fs.writeFile(sFilePath, csv, function (err) {
            if(err) {
              console.log(err);
            }
          });
        }
  });
  }

  async function delay(iMilliSeconds) {
    return new Promise(resolve => setTimeout(resolve, iMilliSeconds));
  }

module.exports = {
   prepareTree,
   getRandomString,
   getRandomInteger,
   writeToFile,
   delay
    }