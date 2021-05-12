const fs = require('fs');
const json2Csv = require('json2csv').parse;

function prepareTree(aItems, sInternalId, sParentId) {
  const aTree = [];
  const oFlat = {};

  aItems.forEach(oItem => {
    oItem['children'] = [];
    oFlat[oItem[sInternalId]] = oItem;
  });

  aItems.forEach(oItem => {
    if (oItem[sParentId] && oFlat[oItem[sParentId]]) {
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

function getRandomString(iLength) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let sString = '';
  for (let i = 0; i < iLength; i++) {
    sString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return sString;
}

function getRandomInteger(iMin, iMax) {
  return Math.floor(Math.random() * (iMax - iMin) + iMin);
}

const oStreams = {};

function streamToFile(sFilePath, sData) {
  oStreams[sFilePath] = oStreams[sFilePath] || fs.createWriteStream(sFilePath, { flags: 'a' });
  oStreams[sFilePath].write(sData);
}

function closeStreams() {
  Object.values(oStreams).forEach(oStream => oStream.end());
}

async function writeToFile(sFilePath, oData) {
  let csv;
  if(sFilePath.includes('ContainerStats')){
    csv = prepareContainerStatsData(oData, sFilePath);
  } else {
    csv = prepareQueryData(oData, sFilePath);
  }
    streamToFile(sFilePath, csv);
}

function prepareContainerStatsData(oData, sFilePath){
  const oDataToWrite = {
    memUsage: oData[0].memUsage,
    memLimit: oData[0].memLimit,
    memPercent: oData[0].memPercent,
    cpuPercent: oData[0].cpuPercent,
    netIO_rx: oData[0].netIO.rx,
    netIO_wx: oData[0].netIO.wx,
    blockIO_r: oData[0].blockIO.r,
    blockIO_w: oData[0].blockIO.w,
    cpuTotalUsage: oData[0].cpuStats.cpu_usage.total_usage,
    usageInKernelMode: oData[0].cpuStats.cpu_usage.usage_in_kernelmode,
    usageInUserMode: oData[0].cpuStats.cpu_usage.usage_in_usermode,
    systemCpuUsage: oData[0].cpuStats.system_cpu_usage,
    throttlingDataPeriods: oData[0].cpuStats.throttling_data.periods,
    throttlingDataThrottledPeriods: oData[0].cpuStats.throttling_data.throttled_periods,
    throttlingDataThrottledTime: oData[0].cpuStats.throttling_data.throttled_time,
    memoryStatsMaxUsage: oData[0].memoryStats.max_usage,
    timeStamp: new Date(Date.now())
  }
  const csv = json2Csv(oDataToWrite, { header: !oStreams[sFilePath] ? true : false }) + '\r\n';
  return csv;
}

function prepareQueryData(oData, sFilePath){  
  let csv;
  if (Array.isArray(oData)) {
    oData.forEach(function (oDataToWrite) {
      if (!csv) {
        csv = json2Csv(oDataToWrite, { header: !oStreams[sFilePath] ? true : false }) + '\r\n';
      } else {
        csv += json2Csv(oDataToWrite, { header: false }) + '\r\n';
      }
    });
  } else {
    csv = json2Csv(oData, { header: !oStreams[sFilePath] ? true : false }) + '\r\n';
  }
  return csv;
}

async function delay(iMilliSeconds) {
  return new Promise(resolve => setTimeout(resolve, iMilliSeconds));
}

module.exports = {
  prepareTree,
  getRandomString,
  getRandomInteger,
  closeStreams,
  writeToFile,
  delay
}