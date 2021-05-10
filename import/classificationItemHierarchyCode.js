const {prepareTree} = require('../utils');

async function updateHierarchyCodesPg (db) {
    const aClassificationItems = await db.query(`SELECT "InternalId", "HierarchyCode", "ParentId" FROM "ClassificationItem"`).catch(console.log);
    const aItemsToUpdate = addHierarchyCodes(aClassificationItems.rows, 'InternalId', 'ParentId', 'HierarchyCode');

    //ERROR near WHERE
    //await db.query(`UPDATE "ClassificationItem" SET "HierarchyCode" = ? WHERE "InternalId" = ?`, aItemsToUpdate).catch(console.log);

   await aItemsToUpdate.forEach(row => {
        db.query(`UPDATE "ClassificationItem" SET "HierarchyCode" = $1 WHERE "InternalId" = $2`, row)
        .catch(console.log);
      }); 
}

async function updateHierarchyCodesMongo (db, oModels) {
    //for some reason, still selects all fields
   const aClassificationItems = await oModels.ClassificationItem.find({}, {internalId:1, parentId:1, hierarchyCode:1, _id:0 });
   const aItemsToUpdate = addHierarchyCodes(aClassificationItems, 'internalId', 'parentId', 'hierarchyCode');
   await aItemsToUpdate.forEach(row => {
    oModels.ClassificationItem.updateOne({internalId: row[1]}, {$set: {hierarchyCode: row[0]}}).catch(console.log);        
      }); 
}

function addHierarchyCodes (aItems, sInternalIdField, sParentIdField, sHierarchyCodeField){
    const oTree = prepareTree(aItems, sInternalIdField, sParentIdField);
    const aStack = oTree.tree;
    
    while(aStack.length){
        const oNode = aStack.pop();
        const oParent = oNode[sParentIdField] ? oTree.flat[oNode[sParentIdField]] : null;
        const sHierarchyCode = oParent ? (oParent[sHierarchyCodeField] || '') + oParent[sInternalIdField] + ',' : null;
        oNode[sHierarchyCodeField] = sHierarchyCode;

        aStack.push(...oNode.children);        
    }

    const aItemsToUpdate = oTree.list.map(oItem => [oItem[sHierarchyCodeField], oItem[sInternalIdField]]);
    return aItemsToUpdate;
}

module.exports = {
    updateHierarchyCodesPg,
    updateHierarchyCodesMongo
}