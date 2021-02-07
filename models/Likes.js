const LikesMONGOCOLLECTION = require("../db").db().collection("likes");
const ObjectID = require("mongodb").ObjectID;

const Likes = function(data) {
  this.data = data;
  this.errors = [];
};

Likes.prototype.UpdateLikesData = function(id) {
  return new Promise(async (resolve, reject) => {
    await LikesMONGOCOLLECTION.findOneAndUpdate(
      { authorID: ObjectID(id) },
      { $set: { likes: this.data } }
    );
    resolve("successfully")
  });
};

Likes.prototype.ReadUserLikesData = function(id) {
  return new Promise(async (resolve, reject) => {
    if (typeof(id) !== 'string') {
      reject('');
      return;
    }
    let data = await LikesMONGOCOLLECTION.findOne({ authorID: ObjectID(id) });
    resolve(JSON.stringify(data.likes));
  });
};

module.exports = Likes;
