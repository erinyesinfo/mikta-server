const Data = require("../models/Data");

exports.postSharedData = function(req, res) {
    const data = new Data(req.body);
    const { _id } = req.session.user;
    data.sharedData(_id).then(() => {
        res.send("successfully");
    }).catch(error => {
        res.send("failure");
    });
};

exports.postLikesData = function(req, res) {
    const data = new Data(req.body);
    const { _id } = req.session.user;
    data.likesData(_id).then(() => {
        res.send("successfully");
    }).catch(error => {
        res.send("failure");
    });
};

exports.postCollectionData = function(req, res) {
    const data = new Data(req.body);
    const { _id } = req.session.user;
    data.collectionData(_id).then(() => {
        res.send("successfully");
    }).catch(error => {
        res.send("failure");
    });
};

exports.postFollowingData = function(req, res) {
    const data = new Data(req.body);
    const { _id } = req.session.user;
    data.followingData(_id).then(() => {
        res.send("successfully");
    }).catch(error => {
        res.send("failure");
    });
};
