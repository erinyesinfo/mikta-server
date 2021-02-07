const CollectionsMONGOCOLLECTION = require("../db").db().collection("collections");
const ObjectID = require("mongodb").ObjectID;

const Collections = function(data) {
  this.data = data;
  this.errors = [];
};

Collections.prototype.UpdateCollectionsData = function(id) {
  return new Promise(async (resolve, reject) => {
    await CollectionsMONGOCOLLECTION.findOneAndUpdate(
      { authorID: ObjectID(id) },
      { $set: { collections: this.data } }
    );
    resolve("successfully")
  });
};

Collections.prototype.ReadUserCollectionsData = function(id) {
  return new Promise(async (resolve, reject) => {
    if (typeof(id) !== 'string') {
      reject();
      return;
    }
    let data = await CollectionsMONGOCOLLECTION.findOne({ authorID: ObjectID(id) });
    resolve(JSON.stringify(data.collections));
  });
};

module.exports = Collections;
