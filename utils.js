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

module.exports = {
   prepareTree,
   getRandomString,
   getRandomInteger
    }