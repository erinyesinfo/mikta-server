const dataCollection = require("../db").db().collection("data");
const ObjectID = require("mongodb").ObjectID;

const Data = function(data) {
    this.data = data;
    this.errors = [];
};

// upadate shared data
Data.prototype.sharedData = function(id) {
    return new Promise(async (resolve, reject) => {
        await dataCollection.findOneAndUpdate(
            { authorID: ObjectID(id) },
            { $set: { shared: this.data } }
        );
        resolve("successfully")
    });
};

// upadate likes data
Data.prototype.likesData = function(id) {
    return new Promise(async (resolve, reject) => {
        await dataCollection.findOneAndUpdate(
            { authorID: ObjectID(id) },
            { $set: { likes: this.data } }
        );
        resolve("successfully")
    });
};

// upadate collection data
Data.prototype.collectionData = function(id) {
    return new Promise(async (resolve, reject) => {
        await dataCollection.findOneAndUpdate(
            { authorID: ObjectID(id) },
            { $set: { collection: this.data } }
        );
        resolve("successfully")
    });
};

// upadate following data
Data.prototype.followingData = function(id) {
    return new Promise(async (resolve, reject) => {
        await dataCollection.findOneAndUpdate(
            { authorID: ObjectID(id) },
            { $set: { following: this.data } }
        );
        resolve("successfully")
    });
};

module.exports = Data;
