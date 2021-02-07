const SharedMONGOCOLLECTION = require("../db").db().collection("shared");
const LikesMONGOCOLLECTION = require("../db").db().collection("likes");
const CollectionsMONGOCOLLECTION = require("../db").db().collection("collections");
const ObjectID = require("mongodb").ObjectID;

const Data = function(data) {
  this.data = data;
  this.errors = [];
};

Data.prototype.ReadHomeDataLength = function(id) {
  return new Promise(async (resolve, reject) => {
    if (typeof(id) !== 'string') {
      reject();
      return;
    }
    let sharedData = await SharedMONGOCOLLECTION.aggregate([
        { $match: { authorID: ObjectID(id) } },
        { $project: { totalshared: { $size: "$shared" } } }
    ]).toArray();
    let likesData = await LikesMONGOCOLLECTION.aggregate([
        { $match: { authorID: ObjectID(id) } },
        { $project: { totallikes: { $size: "$likes" } } }
    ]).toArray();
    let collectionsData = await CollectionsMONGOCOLLECTION.aggregate([
        { $match: { authorID: ObjectID(id) } },
        { $project: { totalcollections: { $size: "$collections" } } }
    ]).toArray();
    let data = {
        shared: sharedData[0].totalshared,
        likes: likesData[0].totallikes,
        collections: collectionsData[0].totalcollections,
    };
    resolve(JSON.stringify(data));
  });
};

module.exports = Data;
