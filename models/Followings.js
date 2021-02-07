const FollowingsMONGOCOLLECTION = require("../db").db().collection("followings");
const ObjectID = require("mongodb").ObjectID;

const Followings = function(data) {
  this.data = data;
  this.errors = [];
};

Followings.prototype.UpdateFollowingsData = function(id) {
  return new Promise(async (resolve, reject) => {
    await FollowingsMONGOCOLLECTION.findOneAndUpdate(
      { authorID: ObjectID(id) },
      { $set: { likes: this.data } }
    );
    resolve("successfully")
  });
};

Followings.prototype.ReadUserFollowingsData = function(id) {
  return new Promise(async (resolve, reject) => {
    if (typeof(id) !== 'string') {
      reject();
      return;
    }
    let data = await FollowingsMONGOCOLLECTION.findOne({ authorID: ObjectID(id) });
    resolve(JSON.stringify(data.followings));
  });
};

module.exports = Followings;
