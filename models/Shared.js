const SharedMONGOCOLLECTION = require("../db").db().collection("shared");
const ObjectID = require("mongodb").ObjectID;

const Shared = function(data) {
  this.data = data;
  this.errors = [];
};

Shared.prototype.UpdateSharedData = function(id) {
  return new Promise(async (resolve, reject) => {
    await SharedMONGOCOLLECTION.findOneAndUpdate(
      { authorID: ObjectID(id) },
      { $set: { shared: this.data } }
    );
    resolve("successfully")
  });
};

Shared.prototype.ReadUserSharedData = function(id) {
  return new Promise(async (resolve, reject) => {
    if (typeof(id) !== 'string') {
      reject('');
      return;
    }
    let data = await SharedMONGOCOLLECTION.findOne({ authorID: ObjectID(id) });
    resolve(JSON.stringify(data.shared));
  });
};

module.exports = Shared;
